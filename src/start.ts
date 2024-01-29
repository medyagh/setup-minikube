import {exec} from '@actions/exec'
import {getInput} from '@actions/core'

import {restoreCaches, saveCaches} from './cache'
import {setArgs} from './inputs'
import {installNoneDriverDeps} from './none-driver'

export const startMinikube = async (): Promise<void> => {
  const args = ['start']
  setArgs(args)
  const cacheHits = await restoreCaches()
  await installNoneDriverDeps()
  const installPath = getInput('install-path')
  await exec('minikube', args, {cwd: installPath})
  await saveCaches(cacheHits)
}
