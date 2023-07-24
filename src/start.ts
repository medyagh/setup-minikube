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
  const binPath = getInput('bin-path')
  await exec('minikube', args, {cwd: binPath})
  await saveCaches(cacheHits)
}
