import {getInput, setFailed} from '@actions/core'

import {downloadMinikube} from './download'
import {startMinikube} from './start'

// main thing :)
const run = async (): Promise<void> => {
  try {
    let minikubeVersion = getInput('minikube-version').toLowerCase()
    minikubeVersion = minikubeVersion === 'stable' ? 'latest' : minikubeVersion
    const installPath = getInput('install-path')
    await downloadMinikube(minikubeVersion, installPath)
    await startMinikube()
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message)
    }
  }
}

run()
