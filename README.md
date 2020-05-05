# minikube-action
- Install and starts minikube in github action workflow.
- Test and build your app in a real kubernetes cluster.

### Example workflow 1: start kubernetes on pull request

full  .github/workflows/main.yml
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


### Example workflow 2: Build image and deploy to kubernetes on pull request

