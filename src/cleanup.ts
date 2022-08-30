import {setFailed} from '@actions/core'
import {stopMinikube} from './minikube'

async function run(): Promise<void> {
  try {
    await stopMinikube()
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message)
    }
  }
}

run()
