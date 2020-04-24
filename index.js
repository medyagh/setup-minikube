const core = require('@actions/core');
const exec = require("@actions/exec");
const tc = require("@actions/tool-cache");

function getDownloadUrl(version) {
  const osPlat = os.platform();
  const platform = osPlat === 'win32' ? 'windows' : osPlat;
  const suffix = osPlat === 'win32' ? '.exe' : '';
  return `https://github.com/kubernetes/minikube/releases/download/v${version}/minikube-${platform}-amd64${suffix}`;
}

function downloadMinikube(version) {
  return __awaiter(this, void 0, void 0, function* () {
      let url = getDownloadUrl(version);
      console.info('Downloading minikube from ' + url);
      downloadPath = yield tc.downloadTool(url);
      yield exec.exec('sudo', 'install',downloadPath,'/usr/local/bin/minikube');
      core.addPath('/usr/local/bin/minikube');
  });
}

function startMinikube() {
  return __awaiter(this, void 0, void 0, function* () {
      yield exec.exec('minikube', 'start','--wait=all');
  });
}


try {
  const driver = core.getInput('driver');
  console.log(`Hello ${driver}!`);
  function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield downloadMinikube('1.9.2');
            yield startMinikube();
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
  }
  run();




} catch (error) {
  core.setFailed(error.message);
}