---
title: Using Docker image in Kubernetes
summary: This document describe how to embed API Console in an existing project
authors:
    - Pawel Psztyc
date: 2019-12-04
---
# Docker image and Kubernetes

The standa-alone application can run in Kubernetes using our image [gcr.io/api-console-a6952/app](https://gcr.io/api-console-a6952/app).
Before using it check for the latest version of the image by visiting the link.

## Usage

```bash
docker run  \
  -v "$PWD":/app/api \
  -e API_PROJECT="api.raml" \
  -e API_TYPE="RAML 1.0" \
  -e API_MIME="application/raml" \
  gcr.io/api-console-a6952/app:0.1.0
```

This command assumes that you are running it in your API definition folder.

The `-v "$PWD":/app/api` option tells the docker to mount current directory (`"$PWD"`) to `/app/api` of the running instance. The application looks for the API data there.

`-e API_PROJECT="api.raml"` **is required** variable and it points to API main file in the current directory.

!!! info "Remote sources"
    The `API_PROJECT` variable can points to a publicly accessible API specification file on the internet.
    In this case the `-v` option is not needed.

`-e API_TYPE="RAML 1.0"` variable tells the application what is the type of the API. It must be one of the [supported API formats](../advanced/parsing-amf.md).

!!! info "Automatic type lookup"
    When `API_TYPE` or `API_MIME` variable is not set then the application tries to
    recognize the correct value. If the automation fails try to define own values.

`-e API_MIME="application/raml"` variable represents the media type of the API.
RAML project has only `application/raml` mime type. OAS can be `application/yaml` or `application/json`.

## Application port

By default the application runs on port 8080. You can change this behavior by setting `PORT` environment variable.

## Deploying to Kubernetes

Below is an example deployment configuration for your container.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: apiconsole-frontend
  labels:
    app: apiconsole-www
spec:
  selector:
    matchLabels:
      app: apiconsole
      tier: frontend
  replicas: 3
  template:
    metadata:
      labels:
        app: apiconsole
        tier: frontend
    spec:
      containers:
      - name: apiconsole-www
        image: gcr.io/api-console-a6952/app:0.1.0
        env:
        - name: API_PROJECT
          value: https://domain.com/api.raml
        - name: API_TYPE
          value: "RAML 1.0"
        - name: API_MIME
          value: "application/raml"
```

This example assumes the API is available publicly over internet. You can use `volumes` property in the deployment configuration.
See [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and [Volumes](https://kubernetes.io/docs/concepts/storage/volumes/) documentation for more details.
