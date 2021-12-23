import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as io from '@actions/io';
import * as path from 'path';

export function setArgs(args: string[]) {
  const inputs: { key: string, flag: string }[] = [
    { key: "driver", flag: "--driver" },
    { key: "container-runtime", flag: "--container-runtime" },
    { key: "kubernetes-version", flag: "--kubernetes-version" }
  ];
  inputs.forEach(input => {
    const value = core.getInput(input.key).toLowerCase();
    if (value !== '') {
      args.push(input.flag, value);
    }
  });
}

export async function startMinikube(): Promise<void> {
  const args = ['start', '--wait', 'all'];
  setArgs(args);
  await exec.exec('minikube', args);
}

export function getDownloadUrl(version: string): string {
  const osPlat = os.platform();
  const platform = osPlat === 'win32' ? 'windows' : osPlat;
  const suffix = osPlat === 'win32' ? '.exe' : '';
  switch (version) {
    case 'latest':
      return `https://github.com/kubernetes/minikube/releases/latest/download/minikube-${platform}-amd64${suffix}`;
    case 'head':
      return `https://storage.googleapis.com/minikube-builds/master/minikube-${platform}-amd64${suffix}`
    default:
      return `https://github.com/kubernetes/minikube/releases/download/v${version}/minikube-${platform}-amd64${suffix}`;
  }
}

export async function downloadMinikube(version: string): Promise<void> {
  const url = getDownloadUrl(version);
  const downloadPath = await tc.downloadTool(url);
  const binPath =
    os.platform() === 'darwin' ? '/Users/runner/bin' : '/home/runner/bin';
  await io.mkdirP(binPath);
  await exec.exec('chmod', ['+x', downloadPath]);
  await io.mv(downloadPath, path.join(binPath, 'minikube'));
  core.addPath(binPath);
}
