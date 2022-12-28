import os from 'os'

import {getDownloadURL} from '../src/download'

jest.mock('os')
const mockedOS = jest.mocked(os)

test('getDownloadURL Unix latest', () => {
  mockedOS.platform.mockReturnValue('linux')

  const url = getDownloadURL('latest')

  expect(url).toBe(
    'https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64'
  )
})

test('getDownloadURL Windows latest', () => {
  mockedOS.platform.mockReturnValue('win32')

  const url = getDownloadURL('latest')

  expect(url).toBe(
    'https://github.com/kubernetes/minikube/releases/latest/download/minikube-windows-amd64.exe'
  )
})

test('getDownloadURL Unix head', () => {
  mockedOS.platform.mockReturnValue('linux')

  const url = getDownloadURL('head')

  expect(url).toBe(
    'https://storage.googleapis.com/minikube-builds/master/minikube-linux-amd64'
  )
})

test('getDownloadURL Windows head', () => {
  mockedOS.platform.mockReturnValue('win32')

  const url = getDownloadURL('head')

  expect(url).toBe(
    'https://storage.googleapis.com/minikube-builds/master/minikube-windows-amd64.exe'
  )
})

test('getDownloadURL Unix version', () => {
  mockedOS.platform.mockReturnValue('linux')

  const url = getDownloadURL('1.28.0')

  expect(url).toBe(
    'https://github.com/kubernetes/minikube/releases/download/v1.28.0/minikube-linux-amd64'
  )
})

test('getDownloadURL Windows version', () => {
  mockedOS.platform.mockReturnValue('win32')

  const url = getDownloadURL('1.28.0')

  expect(url).toBe(
    'https://github.com/kubernetes/minikube/releases/download/v1.28.0/minikube-windows-amd64.exe'
  )
})
