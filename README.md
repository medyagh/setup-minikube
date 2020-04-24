# minikube-action

 Installs and starts minikube in a github action job with one command.
 it will also verify the following kubernetes components are runnning before finishing start.
 - apiserver
 - system pods
 - default service account
 - k8s-apps running (coredns,...)

### Example1 : Start a kubernets cluster in a github action.

start a cluster.
run kubectl against the cluster.

full example .github/workflows/main.yml
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
      uses: medyagh/minikube-action@master
    # now you can run kubectl to see the pods in the cluster
    - name: kubectl 
      run: kubectl get pods -A
```

