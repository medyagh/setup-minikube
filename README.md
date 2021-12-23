
## About setup-minikube
- build/deploy/test your application against a real Kubernetes cluster in GitHub Actions.
- maintained by minikube maintainers. 

## Basic Usage
```
    steps:
    - name: start minikube
      id: minikube
      uses: medyagh/setup-minikube@master

```

## Cofigurable Fields
- minikube-version (optional)
  - default: latest
  - options: 
      - version in format of 'X.X.X'
      - 'latest' for the latest stable release
      - 'HEAD' for the latest development build
  - example: 1.24.0

- driver (optional)
  - default: '' (minikube will auto-select)
  - options: 
    - docker
    - none (baremetal)
    - virtualbox (available on macOs free agents)
    - also if installed on agent you can also use:
      - podman (if installed)
      - parallels 
      - vmwarefusion
      - hyperkit
      - vmware
      - ssh
- container-runtime (optional)
  - description: Choose a specific container-runtime
  - options: 
    - docker (default)
    - containerd
    - cri-o

## Examples
- [Example 1: Start Kubernetes on pull request](https://github.com/medyagh/setup-minikube#example-1)

- [Example 2: Start Kubernetes and specify minikube version, driver and container-runtime](https://github.com/medyagh/setup-minikube#example-2)

- [Example 3: Build image and deploy to Kubernetes on pull request](https://github.com/medyagh/setup-minikube#example-3)

## Example 1: 
#### Start Kubernetes on pull request

```
name: CI
on:
  - pull_request
jobs:
  job1:
    runs-on: ubuntu-latest
    name: job1
    steps:
    - name: start minikube
      id: minikube
      uses: medyagh/setup-minikube@master
    # now you can run kubectl to see the pods in the cluster
    - name: kubectl
      run: kubectl get pods -A
```

## Example 2
### Start Kubernetes on pull request and specify minikube version, driver, and container-runtime

```
name: CI
on:
  - pull_request
jobs:
  job1:
    runs-on: ubuntu-latest
    name: job1
    steps:
    - name: start minikube
      id: minikube
      with:
        minikube-version: 1.24.0
        driver: docker
        container-runtime: containerd
      uses: medyagh/setup-minikube@master
    # now you can run kubectl to see the pods in the cluster
    - name: kubectl
      run: kubectl get pods -A
```

## Example 3:
### Build image and deploy to Kubernetes on pull request
```
name: CI
on:
  - push
  - pull_request
jobs:
  job1:
    runs-on: ubuntu-latest
    name: build discover and deploy
    steps:
    - uses: actions/checkout@v2
    - name: Start minikube
      uses: medyagh/setup-minikube@master
      # now you can run kubectl to see the pods in the cluster
    - name: Try the cluster!
      run: kubectl get pods -A
    - name: Build image
      run: |
        export SHELL=/bin/bash
        eval $(minikube -p minikube docker-env)
        make build-image
        echo -n "verifying images:"
        docker images
    - name: Deploy to minikube
      run:
        kubectl apply -f deploy/deploy-minikube.yaml
    - name: Test service URLs
      run: |
        minikube service list
        minikube service discover --url
        echo -n "------------------opening the service------------------"
        curl $(minikube service discover --url)/version
```

[More examples](https://github.com/medyagh/setup-minikube/tree/master/examples)

## About Auhtor

Medya Ghazizadeh, Follow me on [twitter](https://twitter.com/medya_dev) for my dev news !
