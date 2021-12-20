import * as core from '@actions/core'

import {DownloadMinikube, StartMinikube} from './minikube'

async function run(): Promise<void> {
  try {
    await DownloadMinikube(core.getInput('minikube-version'))
    await StartMinikube()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
