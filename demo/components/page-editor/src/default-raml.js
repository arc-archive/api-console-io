export default `#%RAML 1.0
title: API body demo
version: v1
baseUri: http://api.domain.com/

mediaType: [application/json, application/xml]
protocols: [HTTP, HTTPS]

/path:
  description: |
    This is a description for an endpoint

  get:
    displayName: Test GET
    description: |
      This is a description of a method.
    responses:
      404:
        body:
          displayName: Not found response`;
