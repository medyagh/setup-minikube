import os from 'os'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as tc from '@actions/tool-cache'
import * as fs from 'fs'
import * as fsPromises from 'fs/promises'

import {getDownloadURL, downloadMinikube} from '../src/download'

jest.mock('os')
jest.mock('@actions/core')
jest.mock('@actions/exec')
jest.mock('@actions/io')
jest.mock('@actions/tool-cache')
jest.mock('fs')
jest.mock('fs/promises')

const mockedOS = jest.mocked(os)
const mockedCore = jest.mocked(core)
const mockedExec = jest.mocked(exec)
const mockedIO = jest.mocked(io)
const mockedTC = jest.mocked(tc)
const mockedFS = jest.mocked(fs)
const mockedFSPromises = jest.mocked(fsPromises)

test('getDownloadURL Linux', () => {
  const tests = [
    {
      arch: 'x64',
      version: 'latest',
      expected:
        'https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64',
    },
    {
      arch: 'arm64',
      version: 'latest',
      expected:
        'https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-arm64',
    },
    {
      arch: 'arm',
      version: 'latest',
      expected:
        'https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-arm',
    },
    {
      arch: 's390x',
      version: 'latest',
      expected:
        'https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-s390x',
    },
    {
      arch: 'ppc64',
      version: 'latest',
      expected:
        'https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-ppc64le',
    },
    {
      arch: 'x64',
      version: 'head',
      expected:
        'https://storage.googleapis.com/minikube-builds/master/minikube-linux-amd64',
    },
    {
      arch: 'arm64',
      version: 'head',
      expected:
        'https://storage.googleapis.com/minikube-builds/master/minikube-linux-arm64',
    },
    {
      arch: 'arm',
      version: 'head',
      expected:
        'https://storage.googleapis.com/minikube-builds/master/minikube-linux-arm',
    },
    {
      arch: 's390x',
      version: 'head',
      expected:
        'https://storage.googleapis.com/minikube-builds/master/minikube-linux-s390x',
    },
    {
      arch: 'ppc64',
      version: 'head',
      expected:
        'https://storage.googleapis.com/minikube-builds/master/minikube-linux-ppc64le',
    },
    {
      arch: 'x64',
      version: '1.28.0',
      expected:
        'https://github.com/kubernetes/minikube/releases/download/v1.28.0/minikube-linux-amd64',
    },
    {
      arch: 'arm64',
      version: '1.28.0',
      expected:
        'https://github.com/kubernetes/minikube/releases/download/v1.28.0/minikube-linux-arm64',
    },
    {
      arch: 'arm',
      version: '1.28.0',
      expected:
        'https://github.com/kubernetes/minikube/releases/download/v1.28.0/minikube-linux-arm',
    },
    {
      arch: 's390x',
      version: '1.28.0',
      expected:
        'https://github.com/kubernetes/minikube/releases/download/v1.28.0/minikube-linux-s390x',
    },
    {
      arch: 'ppc64',
      version: '1.28.0',
      expected:
        'https://github.com/kubernetes/minikube/releases/download/v1.28.0/minikube-linux-ppc64le',
    },
  ]

  for (const tc of tests) {
    mockedOS.arch.mockReturnValue(tc.arch as NodeJS.Architecture)
    mockedOS.platform.mockReturnValue('linux')

    const url = getDownloadURL(tc.version)

    expect(url).toBe(tc.expected)
  }
})

test('getDownloadURL macOS', () => {
  const tests = [
    {
      arch: 'x64',
      version: 'latest',
      expected:
        'https://github.com/kubernetes/minikube/releases/latest/download/minikube-darwin-amd64',
    },
    {
      arch: 'arm64',
      version: 'latest',
      expected:
        'https://github.com/kubernetes/minikube/releases/latest/download/minikube-darwin-arm64',
    },
    {
      arch: 'x64',
      version: 'head',
      expected:
        'https://storage.googleapis.com/minikube-builds/master/minikube-darwin-amd64',
    },
    {
      arch: 'arm64',
      version: 'head',
      expected:
        'https://storage.googleapis.com/minikube-builds/master/minikube-darwin-arm64',
    },
    {
      arch: 'x64',
      version: '1.28.0',
      expected:
        'https://github.com/kubernetes/minikube/releases/download/v1.28.0/minikube-darwin-amd64',
    },
    {
      arch: 'arm64',
      version: '1.28.0',
      expected:
        'https://github.com/kubernetes/minikube/releases/download/v1.28.0/minikube-darwin-arm64',
    },
  ]

  for (const tc of tests) {
    mockedOS.arch.mockReturnValue(tc.arch as NodeJS.Architecture)
    mockedOS.platform.mockReturnValue('darwin')

    const url = getDownloadURL(tc.version)

    expect(url).toBe(tc.expected)
  }
})

test('getDownloadURL Windows', () => {
  const tests = [
    {
      arch: 'x64',
      version: 'latest',
      expected:
        'https://github.com/kubernetes/minikube/releases/latest/download/minikube-windows-amd64.exe',
    },
    {
      arch: 'x64',
      version: 'head',
      expected:
        'https://storage.googleapis.com/minikube-builds/master/minikube-windows-amd64.exe',
    },
    {
      arch: 'x64',
      version: '1.28.0',
      expected:
        'https://github.com/kubernetes/minikube/releases/download/v1.28.0/minikube-windows-amd64.exe',
    },
  ]

  for (const tc of tests) {
    mockedOS.arch.mockReturnValue(tc.arch as NodeJS.Architecture)
    mockedOS.platform.mockReturnValue('win32')

    const url = getDownloadURL(tc.version)

    expect(url).toBe(tc.expected)
  }
})

describe('downloadMinikube', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedOS.arch.mockReturnValue('x64')
    mockedOS.platform.mockReturnValue('linux')
    mockedOS.homedir.mockReturnValue('/home/user')
    mockedTC.downloadTool.mockResolvedValue('/tmp/downloaded_minikube')
  })

  test('downloads and installs minikube when no pre-existing files exist', async () => {
    mockedFS.existsSync.mockReturnValue(false)

    await downloadMinikube('latest')

    expect(mockedTC.downloadTool).toHaveBeenCalledWith(
      'https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64'
    )
    expect(mockedIO.mkdirP).toHaveBeenCalledWith('/home/user/bin')
    expect(mockedExec.exec).toHaveBeenCalledWith('chmod', ['+x', '/tmp/downloaded_minikube'])
    expect(mockedIO.cp).toHaveBeenCalledWith(
      '/tmp/downloaded_minikube',
      '/home/user/bin/minikube.tmp'
    )
    expect(mockedFSPromises.rename).toHaveBeenCalledWith(
      '/home/user/bin/minikube.tmp',
      '/home/user/bin/minikube'
    )
    expect(mockedIO.rmRF).toHaveBeenCalledWith('/tmp/downloaded_minikube')
    expect(mockedCore.addPath).toHaveBeenCalledWith('/home/user/bin')
    expect(mockedCore.info).not.toHaveBeenCalled()
  })

  test('removes pre-existing temporary file if it exists', async () => {
    mockedFS.existsSync
      .mockReturnValueOnce(true)  // tmpDestPath exists
      .mockReturnValueOnce(false) // destPath does not exist

    await downloadMinikube('latest')

    expect(mockedIO.rmRF).toHaveBeenCalledWith('/home/user/bin/minikube.tmp')
    expect(mockedIO.cp).toHaveBeenCalledWith(
      '/tmp/downloaded_minikube',
      '/home/user/bin/minikube.tmp'
    )
    expect(mockedFSPromises.rename).toHaveBeenCalledWith(
      '/home/user/bin/minikube.tmp',
      '/home/user/bin/minikube'
    )
    expect(mockedIO.rmRF).toHaveBeenCalledWith('/tmp/downloaded_minikube')
  })

  test('replaces existing minikube binary atomically if it exists', async () => {
    mockedFS.existsSync
      .mockReturnValueOnce(false) // tmpDestPath does not exist
      .mockReturnValueOnce(true)  // destPath exists

    await downloadMinikube('latest')

    expect(mockedIO.rmRF).not.toHaveBeenCalledWith('/home/user/bin/minikube.tmp')
    expect(mockedIO.rmRF).not.toHaveBeenCalledWith('/home/user/bin/minikube')
    expect(mockedIO.cp).toHaveBeenCalledWith(
      '/tmp/downloaded_minikube',
      '/home/user/bin/minikube.tmp'
    )
    expect(mockedCore.info).toHaveBeenCalledWith(
      'Minikube already exists at /home/user/bin/minikube, replacing it atomically...'
    )
    expect(mockedFSPromises.rename).toHaveBeenCalledWith(
      '/home/user/bin/minikube.tmp',
      '/home/user/bin/minikube'
    )
  })
})
