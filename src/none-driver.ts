import {getInput} from '@actions/core'
import {exec} from '@actions/exec'
import {downloadTool} from '@actions/tool-cache'

// TODO: automate updating these versions
const cniPluginsVersion = 'v1.6.2'
const criDockerVersion = 'v0.3.16'
const crictlVersion = 'v1.32.0'

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
  let codename = ''
  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        codename += data.toString()
      },
    },
  }
  await exec('lsb_release', ['--short', '--codename'], options)
  codename = codename.trim()

  // Check if the codename is one of the expected values
  // because Cri-dockerd doesnt support "noble" yet, we will default to "jammy"
  if (!['bionic', 'focal', 'jammy'].includes(codename)) {
    codename = 'jammy'
  }

  const criDockerURL = `https://github.com/Mirantis/cri-dockerd/releases/download/${criDockerVersion}/cri-dockerd_${criDockerVersion.replace(
    /^v/,
    ''
  )}.3-0.ubuntu-${codename}_amd64.deb`
  const criDockerDownload = downloadTool(criDockerURL)
  await exec('sudo', ['dpkg', '--install', await criDockerDownload])
}

const installConntrackSocatCriDocker = async (): Promise<void> => {
  await exec('sudo', ['apt-get', 'update', '-qq'])
  await exec('sudo', ['apt-get', '-qq', '-y', 'install', 'conntrack', 'socat'])
  // Need to wait for the dpkg frontend lock to install cri-docker
  await installCriDocker()
}

const installCrictl = async (): Promise<void> => {
  const crictlURL = `https://github.com/kubernetes-sigs/cri-tools/releases/download/${crictlVersion}/crictl-${crictlVersion}-linux-amd64.tar.gz`
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
