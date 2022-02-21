# API Console www

This project contains sources for API Console website.

It consists of 3 services:

- Application www page
- Demo page with usage examples
- Documentation service

All is bundled in a container and hosted on GKE.

## Building all services

```bash
npm run build:app
npm run build:demo
npm run build:docs
```

## Building and deploying the container

**Bump project version before building and deploying new version.**

```bash
npm run gke:build
npm run gke:deploy
```

You need to have access to Google's `api-console-a6952` project or change
script's body to use different project.

## Rolling update

Go to [cloud console](https://console.cloud.google.com/kubernetes/deployment/us-central1-a/api-console-cluster/default/apiconsole-frontend?project=api-console-a6952) and select Rolling update from Actions menu. Roll out new version of the application for each container.
