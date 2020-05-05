import * as core from '@actions/core'


import {wait, DownloadMinikube, StartMinikube} from './minikube'

async function run(): Promise<void> {
  try {

    await DownloadMinikube('1.10.0-beta.1');
    console.info('Starting minikube');
    await StartMinikube();
    console.info('Finished starting minikube');



    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`)
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
