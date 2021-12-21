import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as io from '@actions/io';
import * as path from 'path';

export async function startMinikube(): Promise<void> {
  const args = ['start', '--wait', 'all']
  const driver = core.getInput('driver')
  if (driver !== '') {
	  args.push('--driver', driver)
  }
  const containerRuntime = core.getInput('container-runtime')
  if (containerRuntime !== '') {
	  args.push('--container-runtime', containerRuntime)
  }
  await exec.exec('minikube', args)
}

export function getDownloadUrl(version: string): string {
  const osPlat = os.platform();
  const platform = osPlat === 'win32' ? 'windows' : osPlat;
  const suffix = osPlat === 'win32' ? '.exe' : '';
  if (version === 'latest') {
    return `https://github.com/kubernetes/minikube/releases/latest/download/minikube-${platform}-amd64${suffix}`;
  }
  return `https://github.com/kubernetes/minikube/releases/download/v${version}/minikube-${platform}-amd64${suffix}`;
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
