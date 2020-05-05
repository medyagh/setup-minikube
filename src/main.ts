import * as core from '@actions/core'

import {DownloadMinikube, StartMinikube} from './minikube'

async function run(): Promise<void> {
  try {
    await DownloadMinikube('1.10.0-beta.1')
    await StartMinikube()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
