---
title: Working with API Components
summary: This document describe how to embed API components like Anypoint Exchange by using composite components of the API Console.
authors:
    - Pawel Psztyc
date: 2020-01-15
---

# Working with API Components

API Console consist of several so called composite components. This components include even more components that are responsible for rendering current view. It can be a documentation view which can render documentation for a method, an endpoint, a type, and so on. It can also be a request panel that renders the "Try it".

You can incorporate API Console like experience in your existing product by using the components directly. This way you can improve user experience by applying your application UI. Such approach has been used in Anypoint Exchange to integrate the console with existing UI regions.

This document described what should be taken into account when considering using the components instead of API Console element.

# API Console composition

To seamlessly integrate the console with an existing application the following top level components can be used to recreate API Console's experience:

-   `@api-components/api-navigation` - generates tree view with the documentation items supported by the console
-   `@api-components/api-documentation` - renders documentation for current selection in the navigation
-   `@api-components/api-request-panel` - the request editor and response viewer
-   (optional) `@advanced-rest-client/xhr-simple-request` - request making engine for API Console
-   (optional) `@advanced-rest-client/oauth-authorization` - support for OAuth 1/2 authorization

After installing the components as a dependency import the sources into the application. The components can then be used like any other HTML element.

# Incorporating the components

## Building the HTML

```html
<!doctype html>
<html lang="en">
  <head>
    <title>My API portal</title>
    <script type="module">
    import '@api-components/api-navigation/api-navigation.js';
    import '@api-components/api-documentation/api-documentation.js';
    import '@api-components/api-request-panel/api-request-panel.js';
    import '@advanced-rest-client/xhr-simple-request/xhr-simple-request.js';
    import '@advanced-rest-client/oauth-authorization/oauth1-authorization.js';
    import '@advanced-rest-client/oauth-authorization/oauth2-authorization.js';
    </script>
    <script src="./vendor.js"></script>
  </head>
  <body>
    <header>
      <h1>My API page</h1>
    </header>

    <nav>
      <api-navigation endpointsopened rearrangeendpoints></api-navigation>
    </nav>

    <main>
      <api-documentation notryit></api-documentation>
      <api-request-panel></api-request-panel>
    </main>

    <xhr-simple-request></xhr-simple-request>
    <oauth1-authorization></oauth1-authorization>
    <oauth2-authorization></oauth2-authorization>
  </body>
</html>
```

The `vendor.js` file is explained in the Building section.

## Passing AMF data

The HTML file above doesn't do much. API Console needs a data model generated from by the AMF parser. See _Working with AMF model_ document for detailed explanation.

Normally some kind of state management and templating system would be used. This example shows a principle that can be translated into specific framework.

```html
<script>
{
  const model = await generateApiModel();
  const nodes = document.querySelectorAll('api-navigation,api-documentation,api-request-panel');
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.amf = model;
  }
}
</script>
```

Finally, the next step is to propagate user selection in the navigation to the rest of the components.

## Selection state management

Again, normally some kind of state management system would be used here. This shows a principle rather a ready solution.

The navigation dispatches `api-navigation-selection-changed` custom event when the user changes the selection. It carries 2 information: the selection and the type of the selection.
Selection is AMF model internal ID of a shape to be rendered in the view. The type tells the documentation and request panel where to search for the data in the AMF model. It can be something like `method`, `endpoint`, `type`, and so on.

The application should handle this event and propagate it to the other components so they can make a decision whether to render the content or not (the request panel only renders data when the selection is a `method`).

```html
<script>
{
  const nav = document.querySelector('api-navigation');
  nav.addEventListener('api-navigation-selection-changed', (e) => {
    const { selected, type } = e.detail;
    const nodes = document.querySelectorAll('api-documentation,api-request-panel');
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.selected = selected;
      node.selectedType = type;
    }
  });
}
</script>
```
