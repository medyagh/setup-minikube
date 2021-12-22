import * as core from '@actions/core';

import {downloadMinikube, startMinikube} from './minikube';
// main thing :)
async function run(): Promise<void> {
  try {
    await downloadMinikube(core.getInput('minikube-version').toLowerCase());
    await startMinikube();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
