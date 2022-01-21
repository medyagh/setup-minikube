import {getInput, setFailed} from '@actions/core'

import {downloadMinikube, startMinikube} from './minikube'
// main thing :)
async function run(): Promise<void> {
  try {
    let minikubeVersion = getInput('minikube-version').toLowerCase()
    minikubeVersion = minikubeVersion === 'stable' ? 'latest' : minikubeVersion
    await downloadMinikube(minikubeVersion)
    await startMinikube()
  } catch (error) {
    setFailed(error.message)
  }
}

run()
