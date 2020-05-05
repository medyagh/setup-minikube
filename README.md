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
    - name: Try the cluster !
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

For more Examples See [examples](https://github.com/medyagh/setup-minikube/tree/master/examples) 