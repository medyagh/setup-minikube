import {addPath, getInput} from '@actions/core'
import {exec} from '@actions/exec'
import {downloadTool} from '@actions/tool-cache'
import {platform as getPlatform} from 'os'
import {mkdirP, mv} from '@actions/io'
import {join} from 'path'

export function setArgs(args: string[]) {
  const reservedStartArgs: string[] = args
  const inputs: {key: string; flag: string}[] = [
    {key: 'driver', flag: '--driver'},
    {key: 'container-runtime', flag: '--container-runtime'},
    {key: 'kubernetes-version', flag: '--kubernetes-version'},
    {key: 'cpus', flag: '--cpus'},
    {key: 'memory', flag: '--memory'},
    {key: 'cni', flag: '--cni'},
  ]
  inputs.forEach((input) => {
    reservedStartArgs.push(input.key)
    const value = getInput(input.key).toLowerCase()
    if (value !== '') {
      args.push(input.flag, value)
    }
  })

  const startArgs = getInput('start-args').split('')
  startArgs.forEach((arg) => {
    if (reservedStartArgs.indexOf(arg) != -1) {
      throw new Error(`${arg} is a reserved start-arg`)
    }

    args.push(arg)
  })
}

export async function installCriDocker(): Promise<void> {
  const urlBase =
    'https://storage.googleapis.com/setup-minikube/cri-dockerd/v0.2.3/'
  const binaryDownload = downloadTool(urlBase + 'cri-dockerd')
  const serviceDownload = downloadTool(urlBase + 'cri-docker.service')
  const socketDownload = downloadTool(urlBase + 'cri-docker.socket')
  await exec('chmod', ['+x', await binaryDownload])
  await exec('sudo', ['mv', await binaryDownload, '/usr/bin/cri-dockerd'])
  await exec('sudo', [
    'mv',
    await serviceDownload,
    '/usr/lib/systemd/system/cri-docker.service',
  ])
  await exec('sudo', [
    'mv',
    await socketDownload,
    '/usr/lib/systemd/system/cri-docker.socket',
  ])
}

export async function installConntrackSocat(): Promise<void> {
  await exec('sudo', ['apt-get', 'update', '-qq'])
  await exec('sudo', ['apt-get', '-qq', '-y', 'install', 'conntrack', 'socat'])
}

export async function installCrictl(): Promise<void> {
  const crictlURL =
    'https://github.com/kubernetes-sigs/cri-tools/releases/download/v1.17.0/crictl-v1.17.0-linux-amd64.tar.gz'
  const crictlDownload = downloadTool(crictlURL)
  await exec('sudo', [
    'tar',
    'zxvf',
    await crictlDownload,
    '-C',
    '/usr/local/bin',
  ])
}

export async function installNoneDriverDeps(): Promise<void> {
  const driver = getInput('driver').toLowerCase()
  if (driver !== 'none') {
    return
  }
  await Promise.all([
    installCriDocker(),
    installConntrackSocat(),
    installCrictl(),
  ])
}

export async function startMinikube(): Promise<void> {
  const args = ['start', '--wait', 'all']
  setArgs(args)
  await installNoneDriverDeps()
  await exec('minikube', args)
}

export async function stopMinikube(): Promise<void> {
  const args = ['stop', '--cancel-scheduled', '--all']
  await exec('minikube', args)
}

export function getDownloadUrl(version: string): string {
  const osPlat = getPlatform()
  const platform = osPlat === 'win32' ? 'windows' : osPlat
  const suffix = osPlat === 'win32' ? '.exe' : ''
  switch (version) {
    case 'latest':
      return `https://github.com/kubernetes/minikube/releases/latest/download/minikube-${platform}-amd64${suffix}`
    case 'head':
      return `https://storage.googleapis.com/minikube-builds/master/minikube-${platform}-amd64${suffix}`
    default:
      return `https://github.com/kubernetes/minikube/releases/download/v${version}/minikube-${platform}-amd64${suffix}`
  }
}

export async function downloadMinikube(version: string): Promise<void> {
  const url = getDownloadUrl(version)
  const downloadPath = await downloadTool(url)
  const binPath =
    getPlatform() === 'darwin' ? '/Users/runner/bin' : '/home/runner/bin'
  await mkdirP(binPath)
  await exec('chmod', ['+x', downloadPath])
  await mv(downloadPath, join(binPath, 'minikube'))
  addPath(binPath)
}
