import os from 'os'

import {getDownloadURL} from '../src/download'

jest.mock('os')
const mockedOS = jest.mocked(os)

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
