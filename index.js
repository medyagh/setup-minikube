const core = require("@actions/core");
const exec = require("@actions/exec");
const tc = require("@actions/tool-cache");
const io = require("@actions/io");
const path = require("path");
const os = require("os");

var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };


  var fs = require('fs'),
  exec = require('child_process').exec,
  isWin = process.platform.indexOf('win') === 0;

function nohup(options, callback){
  if(typeof options === 'function'){
      callback = options;
      options = null;
  }
  exec.exec('nohup','sudo','minikube', 'tunnel', ' > /dev/null 2>&1 &');
}

function getDownloadUrl(version) {
    const osPlat = os.platform();
    const platform = osPlat === 'win32' ? 'windows' : osPlat;
    const suffix = osPlat === 'win32' ? '.exe' : '';
    return `https://github.com/kubernetes/minikube/releases/download/v${version}/minikube-${platform}-amd64${suffix}`;
}

function downloadMinikube(version) {
  return __awaiter(this, void 0, void 0, function* () {
      let url = getDownloadUrl(version);
      console.info('Downloading Minikube from ' + url);
      let downloadPath = null;
      downloadPath = yield tc.downloadTool(url);
      const binPath = '/home/runner/bin';
      yield io.mkdirP(binPath);
      yield exec.exec('chmod', ['+x', downloadPath]);
      yield io.mv(downloadPath, path.join(binPath, 'minikube'));
      core.addPath(binPath);
  });
}

function startMinikube() {
  return __awaiter(this, void 0, void 0, function* () {
      yield exec.exec('minikube', 'start', '--wait=all');
      core.info('minikube started successfully.')
      core.info('starting minikube tunnel in the background')
      nohup(function(){
        console.log('tunnel exited');
      });

      
  });
}

function run() {
  return __awaiter(this, void 0, void 0, function* () {
      try {
          yield downloadMinikube('1.10.0-beta.1');
          console.info('Starting minikube');
          yield startMinikube();
          console.info('Finished starting minikube');
      }
      catch (error) {
          core.setFailed(error.message);
      }
  });
}
run();
