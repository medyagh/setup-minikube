import {getInput} from '@actions/core'
import {exec} from '@actions/exec'
import {downloadTool} from '@actions/tool-cache'

const installCriDocker = async (): Promise<void> => {
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

const installConntrackSocat = async (): Promise<void> => {
  await exec('sudo', ['apt-get', 'update', '-qq'])
  await exec('sudo', ['apt-get', '-qq', '-y', 'install', 'conntrack', 'socat'])
}

const installCrictl = async (): Promise<void> => {
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

export const installNoneDriverDeps = async (): Promise<void> => {
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
