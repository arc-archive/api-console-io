---
title: Working with CORS
summary: This document describe issues around Cross Origin Resource Sharing.
authors:
    - Pawel Psztyc
date: 2020-01-15
---

# CORS

<b>C</b>ross <b>O</b>rigin <b>R</b>esource <b>S</b>haring is a defense mechanism in the web that does not allow to access protected data by unauthorized script. Because of that API calls to a foreign domain are prohibited by default unless the server is configured to inform the browser that the request can be made.

In the enterprise world CORS is rarely enabled. Because of that the "Try It" may not work at all if the documentation is hosted in a different domain than the API. In this case a request made to an endpoint would always result in error and `0` status code. To deal with this issue this document has some possible solutions.

## API Console Chrome extension

In the API Console ecosystem, an extension for Chrome acts as a proxy for the request without CORS limitations. In a supported browser, the install extension banner appears in the request editor. After the extension is installed, all traffic from the console is redirected to the extension to perform the request (without CORS limitations) and to get the response.

API Console has an extension support included into the code base but it is not enabled by default. To enable API Console extension support set `allowExtensionBanner` attribute on the console.

```html
<api-console allowExtensionBanner></api-console>
```

On a supported browser this renders an extension banner asking the user to install the extension if it's not installed.

### TL;DR: Extension technical background

The console listens for the `api-console-extension-installed` event that is fired by the extension. After initialization, the console sends an event to the extension when the user makes the HTTP request. The element responsible for the communication with the extension is [api-console-ext-comm](https://github.com/advanced-rest-client/api-console-ext-comm).

Other ways to deal with CORS are coming soon. File an issue report in this repository if you can help with this issue.

## Proxy server

To deal with CORS, you can use a `proxy` attribute of the element to tell the API console to pass the request through a proxy. After setting the attribute, every request made by the console is passed through the proxy.

Before sending the request to a transport library (possibly the XHR call), the request URL is altered by prefixing the URL with proxy value.

```html
<api-console proxy="https://api.proxy.com/api/proxy/"></api-console>
```

This configuration changes the request endpoint from `http://domain.com/path/?query=some+value` to `https://api.proxy.com/api/proxy/http://domain.com/path/?query=some+value`.

Don't forget to add trailing '/' to the path or the produced URL will be invalid.

If the proxy requires the URL as a query parameter, then the `proxy` attribute should end with
parameter name and `=` sign:

```html
<api-console proxy="https://api.proxy.com/api/proxy/?url=" proxyencodeurl></api-console>
```

In this case, be sure to set the `proxyencodeurl` attribute, so the console URL-encodes the URL before appending it to the final URL.

This configuration changes the request endpoint from `http://domain.com/path/?query=some+value` to `https://api.proxy.com/api/proxy/?url=http%3A%2F%2Fdomain.com%2Fpath%2F%3Fquery%3Dsome%2Bvalue`.

The proxy URL won't be visible to the user. The user can't do anything to change this behavior unless your application includes a custom UI that supports such a change.

## Handling HTTP request by the hosting application

When the user runs the request from the "try it" screen, API Console fires the `api-request` [custom event](https://developer.mozilla.org/en/docs/Web/API/CustomEvent). If your application can handle the transport (by providing a proxy, for example), listen for this event, and cancel it by calling `event.preventDefault()`. If the event is cancelled, API Console listens for the `api-response` custom
event that should contain response details. Otherwise, the console uses the build in fallback function to get the resource using Fetch API / XHR.

See [API Console events handling](../advanced/handling-events-in-component.md) for detailed documentation of the request events.
