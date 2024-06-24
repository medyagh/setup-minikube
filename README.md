
## About setup-minikube
- build/deploy/test your application against a certified Kubernetes cluster in GitHub Actions.
- officialy maintained by minikube maintainers.

## Basic Usage
```
    steps:
      - name: start minikube
        id: minikube
        uses: medyagh/setup-minikube@latest

```

## Caching

By default setup-minikube caches the ISO, kicbase, and preload using GitHub Action Cache, if you'd like to disable this caching add the following to your workflow file.
```
- uses: medyagh/setup-minikube@latest
  with:
    cache: false
```

## Examples
- [Example 1: Start Kubernetes on pull request](https://github.com/medyagh/setup-minikube#example-1)

- [Example 2: Start Kubernetes using all configuration options](https://github.com/medyagh/setup-minikube#example-2)

- [Example 3: Build image and deploy to Kubernetes on pull request](https://github.com/medyagh/setup-minikube#example-3)
- [Real World Examples](https://github.com/medyagh/setup-minikube#Real-World)



## Configurable Fields

<details>
  <summary>start (optional)</summary>
  <pre>
    - default: true
    - options:
      - true
      - false
  </pre>
</details>

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
  <summary>network-plugin (optional)</summary>
  <pre>
    - default: auto
    - options:
      - cni
  </pre>
</details>

<details>
  <summary>cni (optional)</summary>
  <pre>
    - default: '' (auto)
    - options:
      - bridge
      - calico
      - cilium
      - flannel
      - kindnet
      - (path to a CNI manifest)
  </pre>
</details>

<details>
  <summary>wait (optional)</summary>
  <pre>
    - default: all
    - options:
      - comma separated list of Kubernetes components (e.g. apiserver,system_pods,default_sa,apps_running,node_ready,kubelet)
      - all
      - none
      - true
      - false
  </pre>
</details>

<details>
  <summary>addons (optional)</summary>
  <pre>
    - default: ''
    - options:
      - ambassador
      - auto-pause
      - csi-hostpath-driver
      - dashboard
      - default-storageclass
      - efk
      - freshpod
      - gcp-auth
      - gvisor
      - headlamp
      - helm-tiller
      - inaccel
      - ingress
      - ingress-dns
      - istio
      - istio-provisioner
      - kong
      - kubevirt
      - logviewer
      - metallb
      - metrics-server
      - nvidia-driver-installer
      - nvidia-gpu-device-plugin
      - olm
      - pod-security-policy
      - portainer
      - registry
      - registry-aliases
      - registry-creds
      - storage-provisioner
      - storage-provisioner-gluster
      - volumesnapshots
      - (minikube addons list)
    - example: ingress,registry
  </pre>
</details>

<details>
  <summary>extra-config (optional)</summary>
  <pre>
    - default: ''
    - value: Any extra config fields (see [docs](https://minikube.sigs.k8s.io/docs/handbook/config/#kubernetes-configuration))
  </pre>
</details>

<details>
  <summary>feature-gates (optional)</summary>
  <pre>
    - default: ''
    - value: Enable feature gates in API service (see [docs](https://minikube.sigs.k8s.io/docs/handbook/config/#enabling-feature-gates))
  </pre>
</details>

<details>
  <summary>listen-address (optional)</summary>
  <pre>
    - default: ''
    - value: IP Address to use to expose ports (docker and podman driver only)
  </pre>
</details>

<details>
  <summary>mount-path (optional)</summary>
  <pre>
    - default: ''
    - value: Mount the source directory from your host into the target directory inside the cluster (format: <source directory>:<target directory>)
  </pre>
</details>

<details>
  <summary>install-path (optional)</summary>
  <pre>
    - default: ''
    - value: Path where the executables (minikube) will get installed. Useful when having multiple self-hosted runners on one machine.
  </pre>
</details>

<details>
  <summary>insecure-registry (optional)</summary>
  <pre>
    - default: ''
    - value: Any container registry address which is insecure
    - example: localhost:5000,10.0.0.0/24
  </pre>
</details>

<details>
  <summary>start-args (optional)</summary>
  <pre>
    - default: ''
    - value: Any flags you would regularly pass into minikube via CLI
    - example: --delete-on-failure --subnet 192.168.50.0
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
        uses: medyagh/setup-minikube@latest
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
        uses: medyagh/setup-minikube@latest
        id: minikube
        with:
          cache: false
          minikube-version: 1.24.0
          driver: docker
          container-runtime: containerd
          kubernetes-version: v1.22.3
          cpus: 4
          memory: 4000m
          cni: bridge
          addons: registry,ingress
          extra-config: 'kubelet.max-pods=10'
          feature-gates: 'DownwardAPIHugePages=true'
          mount-path: '/Users/user1/test-files:/testdata'
          wait: false
          insecure-registry: 'localhost:5000,10.0.0.0/24'
          start-args: '--delete-on-failure --subnet 192.168.50.0'
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
      - uses: actions/checkout@v4
        with:
          repository: medyagh/local-dev-example-with-minikube
      - name: Start minikube
        uses: medyagh/setup-minikube@latest
      # now you can run kubectl to see the pods in the cluster
      - name: Try the cluster!
        run: kubectl get pods -A
      - name: Build image
        run: |
          minikube image build -t local/devex:v1 .
      - name: Deploy to minikube
        run: |
          kubectl apply -f deploy/k8s.yaml
          kubectl wait --for=condition=ready pod -l app=local-devex
      - name: Test service URLs
        run: |
          minikube service list
          minikube service local-devex-svc --url
          echo -n "------------------opening the service------------------"
          curl $(minikube service local-devex-svc --url)/version
```
## Real World: 
#### Add your own repo here:
- [medyagh/test-minikube-example](https://github.com/medyagh/test-minikube-example)
- [More examples](https://github.com/medyagh/setup-minikube/tree/master/examples)

## About Author

Medya Ghazizadeh, Follow me on [twitter](https://twitter.com/medya_dev) for my dev news!
