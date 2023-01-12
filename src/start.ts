import {exec} from '@actions/exec'

import {restoreCaches, saveCaches} from './cache'
import {setArgs} from './inputs'
import {installNoneDriverDeps} from './none-driver'

export const startMinikube = async (): Promise<void> => {
  const args = ['start']
  setArgs(args)
  const cacheHits = await restoreCaches()
  await installNoneDriverDeps()
  await exec('minikube', args)
  await saveCaches(cacheHits)
}
