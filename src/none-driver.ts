import {getInput} from '@actions/core'
import {exec} from '@actions/exec'
import {downloadTool} from '@actions/tool-cache'

// TODO: automate updating these versions
const cniPluginsVersion = 'v1.6.2'
const criDockerVersion = 'v0.4.0'
const crictlVersion = 'v1.34.0'

const installCniPlugins = async (): Promise<void> => {
  const arch = process.arch === 'arm64' ? 'arm64' : 'amd64'
  const cniPluginsURL = `https://github.com/containernetworking/plugins/releases/download/${cniPluginsVersion}/cni-plugins-linux-${arch}-${cniPluginsVersion}.tgz`
  const cniPluginsDownload = downloadTool(cniPluginsURL)
  await exec('sudo', ['mkdir', '-p', '/opt/cni/bin'])
  await exec('sudo', [
    'tar',
    'zxvf',
    await cniPluginsDownload,
    '-C',
    '/opt/cni/bin',
  ])
}

const installCriDocker = async (): Promise<void> => {
  const arch = process.arch === 'arm64' ? 'arm64' : 'amd64'
  const version = criDockerVersion.replace(/^v/, '')
  const tgzURL = `https://github.com/Mirantis/cri-dockerd/releases/download/${criDockerVersion}/cri-dockerd-${version}.${arch}.tgz`
  const criDockerArchive = downloadTool(tgzURL)
  const extractDir = `/tmp/cri-dockerd-${arch}`

  await exec('mkdir', ['-p', extractDir])
  await exec('tar', ['zxvf', await criDockerArchive, '-C', extractDir])
  await exec('sudo', [
    'mv',
    `${extractDir}/cri-dockerd/cri-dockerd`,
    '/usr/bin/cri-dockerd',
  ])
  await exec('sudo', [
    'mv',
    `${extractDir}/cri-dockerd/cri-docker.socket`,
    '/usr/lib/systemd/system/cri-docker.socket',
  ])
  await exec('sudo', [
    'mv',
    `${extractDir}/cri-dockerd/cri-docker.service`,
    '/usr/lib/systemd/system/cri-docker.service',
  ])
  await exec('sudo', ['chmod', '+x', '/usr/bin/cri-dockerd'])
}

const installConntrackSocatCriDocker = async (): Promise<void> => {
  await exec('sudo', ['apt-get', 'update', '-qq'])
  await exec('sudo', ['apt-get', '-qq', '-y', 'install', 'conntrack', 'socat'])
  // Install cri-docker after dependency packages
  await installCriDocker()
}

const installCrictl = async (): Promise<void> => {
  const arch = process.arch === 'arm64' ? 'arm64' : 'amd64'
  const crictlURL = `https://github.com/kubernetes-sigs/cri-tools/releases/download/${crictlVersion}/crictl-${crictlVersion}-linux-${arch}.tar.gz`
  const crictlDownload = downloadTool(crictlURL)
  await exec('sudo', [
    'tar',
    'zxvf',
    await crictlDownload,
    '-C',
    '/usr/local/bin',
  ])
}

const makeCniDirectoryReadable = async (): Promise<void> => {
  // created by podman package with 700 root:root
  await exec('sudo', ['chmod', '755', '/etc/cni/net.d'])
}

export const installNoneDriverDeps = async (): Promise<void> => {
  const driver = getInput('driver').toLowerCase()
  if (driver !== 'none') {
    return
  }
  await Promise.all([
    installCniPlugins(),
    installConntrackSocatCriDocker(),
    installCrictl(),
    makeCniDirectoryReadable(),
  ])
}
