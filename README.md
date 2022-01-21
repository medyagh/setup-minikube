
## About setup-minikube
- build/deploy/test your application against a real Kubernetes cluster in GitHub Actions.
- maintained by minikube maintainers.

## Basic Usage
```
    steps:
    - name: start minikube
      id: minikube
      uses: medyagh/setup-minikube@latest

```
## Examples
- [Example 1: Start Kubernetes on pull request](https://github.com/medyagh/setup-minikube#example-1)

- [Example 2: Start Kubernetes using all configuration options](https://github.com/medyagh/setup-minikube#example-2)

- [Example 3: Build image and deploy to Kubernetes on pull request](https://github.com/medyagh/setup-minikube#example-3)
- [Real World Examples](https://github.com/medyagh/setup-minikube#Real-World)



## Configurable Fields

<details>
  <summary>minikube-version (optional)</summary>
  <pre>
    - default: latest
    - options:
      - version in format of 'X.X.X'
      - 'latest' for the latest stable release
      - 'HEAD' for the latest development build
    - example: 1.24.0
  </pre>
</details>

<details>
  <summary>driver (optional)</summary>
  <pre>
    - default: '' (minikube will auto-select)
    - options:
      - docker
      - none (baremetal)
      - virtualbox (available on macOS free agents)
      - also possible if installed on self-hosted agent: podman, parallels, vmwarefusion, hyperkit, vmware, ssh
  </pre>
</details>

<details>
  <summary>container-runtime (optional)</summary>
  <pre>
    - default: docker
    - options:
      - docker
      - containerd
      - cri-o
  </pre>
</details>

<details>
  <summary>kubernetes-version (optional)</summary>
  <pre>
    - default: stable
    - options:
      - 'stable' for the latest stable Kubernetes version
      - 'latest' for the Newest Kubernetes version
      - 'vX.X.X'
    - example: v1.23.1
  </pre>
</details>

<details>
  <summary>cpus (optional)</summary>
  <pre>
    - default: '' (minikube will auto-set)
    - options:
      - '<number>'
      - 'max' to use the maximum available CPUs
    - example: 4
  </pre>
</details>

<details>
  <summary>memory (optional)</summary>
  <pre>
    - default: '' (minikube will auto-set)
    - options:
      - '<number><unit>' where unit = b, k, m or g
      - 'max' to use the maximum available memory
    - example: 4000m
  </pre>
</details>

<details>
  <summary>cni (optional)</summary>
  <pre>
    - default: auto
    - options:
      - bridge
      - calico
      - cilium
      - flannel
      - kindnet
      - (path to a CNI manifest)
  </pre>
</details>

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
### Start Kubernetes using all configuration options

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
        kubernetes-version: v1.22.3
        cpus: 4
        memory: 4000m
        cni: bridge
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
## Real World: 
#### Add your own repo here:
- [medyagh/test-minikube-example](https://github.com/medyagh/test-minikube-example)
- [More examples](https://github.com/medyagh/setup-minikube/tree/master/examples)

## About Author

Medya Ghazizadeh, Follow me on [twitter](https://twitter.com/medya_dev) for my dev news!
