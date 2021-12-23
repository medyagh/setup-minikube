import {getInput, setFailed} from '@actions/core'

import {downloadMinikube, startMinikube} from './minikube'
// main thing :)
async function run(): Promise<void> {
  try {
    await downloadMinikube(getInput('minikube-version').toLowerCase())
    await startMinikube()
  } catch (error) {
    setFailed(error.message)
  }
}

run()
