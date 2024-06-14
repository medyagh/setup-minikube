import {addPath} from '@actions/core'
import {exec} from '@actions/exec'
import {mkdirP, cp, rmRF} from '@actions/io'
import {downloadTool} from '@actions/tool-cache'
import {arch, homedir, platform as getPlatform} from 'os'
import {join} from 'path'

export const getDownloadURL = (version: string): string => {
  const osPlat = getPlatform()
  const osArch = getMinikubeArch()
  const platform = osPlat === 'win32' ? 'windows' : osPlat
  const suffix = osPlat === 'win32' ? '.exe' : ''
  switch (version) {
    case 'latest':
      return `https://github.com/kubernetes/minikube/releases/latest/download/minikube-${platform}-${osArch}${suffix}`
    case 'head':
      return `https://storage.googleapis.com/minikube-builds/master/minikube-${platform}-${osArch}${suffix}`
    default:
      return `https://github.com/kubernetes/minikube/releases/download/v${version}/minikube-${platform}-${osArch}${suffix}`
  }
}

const getMinikubeArch = (): string => {
  switch (arch()) {
    case 'x64':
      return 'amd64'
      break
    case 'arm64':
      return 'arm64'
      break
    case 'arm':
      return 'arm'
      break
    case 's390x':
      return 's390x'
      break
    case 'ppc64':
      return 'ppc64le'
      break
    default:
      throw new Error(
        `Machine is of arch ${arch()}, which isn't supported by minikube.`
      )
  }
}

export const downloadMinikube = async (
  version: string,
  installPath?: string
): Promise<void> => {
  const url = getDownloadURL(version)
  const downloadPath = await downloadTool(url)
  if (!installPath) {
    installPath = join(homedir(), 'bin')
  }
  await mkdirP(installPath)
  await exec('chmod', ['+x', downloadPath])
  await cp(downloadPath, join(installPath, 'minikube'))
  await rmRF(downloadPath)
  addPath(installPath)
}
