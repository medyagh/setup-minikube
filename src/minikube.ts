import {addPath, getInput} from '@actions/core'
import {exec} from '@actions/exec'
import {downloadTool} from '@actions/tool-cache'
import {platform as getPlatform} from 'os'
import {mkdirP, mv} from '@actions/io'
import {join} from 'path'

export function setArgs(args: string[]) {
  const inputs: {key: string; flag: string}[] = [
    {key: 'driver', flag: '--driver'},
    {key: 'container-runtime', flag: '--container-runtime'},
    {key: 'kubernetes-version', flag: '--kubernetes-version'},
    {key: 'cpus', flag: '--cpus'},
    {key: 'memory', flag: '--memory'},
    {key: 'cni', flag: '--cni'},
    {key: 'extra-config', flag: '--extra-config'},
  ]
  inputs.forEach((input) => {
    const value = getInput(input.key).toLowerCase()
    if (value !== '') {
      args.push(input.flag, value)
    }
  })
}

export async function startMinikube(): Promise<void> {
  const args = ['start', '--wait', 'all']
  setArgs(args)
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
