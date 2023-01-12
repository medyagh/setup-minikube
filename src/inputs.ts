import {getInput} from '@actions/core'

export const setArgs = (args: string[]) => {
  const inputs: {key: string; flag: string}[] = [
    {key: 'addons', flag: '--addons'},
    {key: 'cni', flag: '--cni'},
    {key: 'container-runtime', flag: '--container-runtime'},
    {key: 'cpus', flag: '--cpus'},
    {key: 'driver', flag: '--driver'},
    {key: 'extra-config', flag: '--extra-config'},
    {key: 'insecure-registry', flag: '--insecure-registry'},
    {key: 'kubernetes-version', flag: '--kubernetes-version'},
    {key: 'listen-address', flag: '--listen-address'},
    {key: 'memory', flag: '--memory'},
    {key: 'mount-path', flag: '--mount-string'},
    {key: 'network-plugin', flag: '--network-plugin'},
    {key: 'wait', flag: '--wait'},
  ]
  inputs.forEach((input) => {
    const value = getInput(input.key).toLowerCase()
    if (value !== '') {
      args.push(input.flag, value)
    }
  })
  if (getInput('mount-path') !== '') {
    args.push('--mount')
  }
}
