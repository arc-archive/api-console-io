---
title: Using API Console
summary: This document describe what are the general use cases for API Console.
authors:
    - Pawel Psztyc
date: 2019-11-15
---

# Usage

!!! warning "Preview version"
    API Console currently is in preview version. Even though the API is pretty stable,
    it may change without any warning.

## Installation

```bash
npm i --save @anypoint-web-components/api-console
```

## Stand-alone application

To use API Console as a stand-alone application use `api-console-app` element provided by `api-console-app.js` file.
The stand-alone application supports routing and layout elements (compared to API Console as an element).

In this mode the console has title bar, drawer that holds the navigation, and main element that holds main scrolling region (the body is not a scrolling region in this case).
It also enables mobile view when viewport width threshold is reached (740px). Wide view is enabled for viewport >= 1500px and includes request panel (try it) on the right hand side of currently rendered method.

Additionally the console application includes `xhr-simple-request`, `oauth1-authorization`, and `oauth2-authorization` components.

See `demo/standalone/index.html` for an example.

## Web component

A web component offers rendering documentation view as a default view, on user request the request panel (when try it button is pressed), and contains an always hidden navigation that cannot be triggered from element's UI. The application that hosts the element must provide some kind of an UI for the user to trigger the navigation. Navigation can be opened by setting the `navigationOpened` property/attribute to `true`.

Because API console as a web component has no layout element you may want to control the height of the console. It should be set as specific value to properly support navigation drawer. Specific value can also be `flex: 1` when flex layout is used.

The API Console element does not include `xhr-simple-request`, `oauth1-authorization`, or `oauth2-authorization` components. This components has to be added to the DOM separately. You can ignore this step when authorization and request events are handled by the hosting application.
See full documentation for [handling API Console events](advanced/handling-events-in-component.md).

See `demo/element/index.html` for an example.
