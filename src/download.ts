import {addPath} from '@actions/core'
import {exec} from '@actions/exec'
import {mkdirP, cp, rmRF} from '@actions/io'
import {downloadTool} from '@actions/tool-cache'
import {platform as getPlatform} from 'os'
import {join} from 'path'

export const getDownloadURL = (version: string): string => {
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

export const downloadMinikube = async (version: string): Promise<void> => {
  const url = getDownloadURL(version)
  const downloadPath = await downloadTool(url)
  const binPath =
    getPlatform() === 'darwin' ? '/Users/runner/bin' : '/home/runner/bin'
  await mkdirP(binPath)
  await exec('chmod', ['+x', downloadPath])
  await cp(downloadPath, join(binPath, 'minikube'))
  await rmRF(downloadPath)
  addPath(binPath)
}
