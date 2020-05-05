# minikube-action
- build/deploy/test your applicaiton against a real kubernetes cluster in github actions.

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
      uses: medyagh/setup-minikube@master
    # now you can run kubectl to see the pods in the cluster
    - name: kubectl 
      run: kubectl get pods -A
```


### Example workflow 2: Build image and deploy to kubernetes on pull request

See [examples](https://github.com/medyagh/setup-minikube/tree/master/examples) folder