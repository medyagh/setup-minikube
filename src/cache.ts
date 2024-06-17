import {
  restoreCache as restoreCacheAction,
  saveCache as saveCacheAction,
} from '@actions/cache'
import {info, getInput as getInputAction} from '@actions/core'
import {exec} from '@actions/exec'
import {existsSync} from 'fs'
import {arch, homedir} from 'os'
import {join} from 'path'

// Catch and log any unhandled exceptions. These exceptions can leak out of the
// uploadChunk method in @actions/toolkit when a failed upload closes the file
// descriptor causing any in-process reads to throw an uncaught exception.
// Instead of failing this action, just warn.
process.on('uncaughtException', (e) => {
  info(`[warning]${e.message}`)
})

type CacheHits = {
  iso: boolean
  kic: boolean
  preload: boolean
}

export const restoreCaches = async (): Promise<CacheHits> => {
  const cacheHits: CacheHits = {iso: true, kic: true, preload: true}
  if (!useCache()) {
    return cacheHits
  }
  const minikubeVersion = await getMinikubeVersion()
  const isoCacheKey = restoreCache('iso', minikubeVersion)
  const kicCacheKey = restoreCache('kic', minikubeVersion)
  const preloadCacheKey = restoreCache('preloaded-tarball', minikubeVersion)
  cacheHits.iso = typeof (await isoCacheKey) !== 'undefined'
  cacheHits.kic = typeof (await kicCacheKey) !== 'undefined'
  cacheHits.preload = typeof (await preloadCacheKey) !== 'undefined'
  return cacheHits
}

export const getMinikubeVersion = async (): Promise<string> => {
  let version = ''
  const options: any = {}
  options.listeners = {
    stdout: (data: Buffer) => {
      version += data.toString()
    },
  }
  await exec('minikube', ['version', '--short'], options)
  return version.trim()
}

export const saveCaches = async (cacheHits: CacheHits): Promise<void> => {
  if (!useCache()) {
    return
  }
  const minikubeVersion = await getMinikubeVersion()
  await Promise.all([
    saveCache('iso', cacheHits.iso, minikubeVersion),
    saveCache('kic', cacheHits.kic, minikubeVersion),
    saveCache('preloaded-tarball', cacheHits.preload, minikubeVersion),
  ])
}

const restoreCache = async (
  name: string,
  minikubeVersion: string
): Promise<string | undefined> => {
  return restoreCacheAction(
    getCachePaths(name),
    getCacheKey(name, minikubeVersion)
  )
}

const saveCache = async (
  name: string,
  cacheHit: boolean,
  minikubeVersion: string
): Promise<void> => {
  if (cacheHit) {
    return
  }
  const cachePaths = getCachePaths(name)
  if (!existsSync(cachePaths[0])) {
    return
  }
  try {
    await saveCacheAction(cachePaths, getCacheKey(name, minikubeVersion))
  } catch (error) {
    console.log(name + error)
  }
}

const getCachePaths = (folderName: string): string[] => {
  return [join(homedir(), '.minikube', 'cache', folderName)]
}

const getCacheKey = (name: string, minikubeVersion: string): string => {
  let cacheKey = `${name}-${minikubeVersion}-${arch()}`
  if (name === 'preloaded-tarball') {
    const kubernetesVersion = getInput('kubernetes-version', 'stable')
    const containerRuntime = getInput('container-runtime', 'docker')
    cacheKey += `-${kubernetesVersion}-${containerRuntime}`
  }
  return cacheKey
}

// getInput gets the specified value from the users workflow yaml
// if the value is empty the default value it returned
const getInput = (name: string, defaultValue: string): string => {
  const value = getInputAction(name).toLowerCase()
  return value !== '' ? value : defaultValue
}

const useCache = (): boolean => getInputAction('cache').toLowerCase() === 'true'
