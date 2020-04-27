# API Console configuration options

## Configuring API console

You can pass a configuration option as HTML attributes:

```html
<api-console appendheaders="x-api-key: 1234" narrow></api-console>
```

which is equivalent of setting properties on the custom element:

```javascript
// Configuring the API Console using JavaScript properties.
const console = document.querySelector('api-console');
console.narrow = true;
console.appendHeaders = 'x-api-key: 1234';
```

**Boolean attributes** are set by simply adding an attribute without any value, or by passing empty value (`attribute=""`) as required by some HTML validators. Lack of an attribute means its value equals `false`.

**Other attributes** are configured by setting the attribute to a value as shown in the example above.

### Data control attributes

#### amf

Type: **Object** or **Array**

Generated AMF json/ld model form the API spec. See [Working with AMF model](advanced/working-with-amf) documentation for more information.

```javascript
const model = await downloadModel();
const apic = document.querySelector('api-console');
apic.amf = model;
```

#### aware

Type: **string**

Uses [raml-aware][] element, with `scope` attribute set to the value of this attribute. See [Working with AMF model](advanced/working-with-amf) documentation for more information.

```html
<raml-aware scope="my-api"></raml-aware>
<api-console aware="my-api"></api-console>
```

```javascript
const model = await downloadModel();
const aware = document.querySelector('raml-aware');
aware.raml = model;
```

#### selectedShape

Type: **String**

Currently selected object. See section [Controlling the view](#controlling-the-view) section below for more information.

```html
<api-console selectedshape="summary"></api-console>
```

```javascript
const apic = document.querySelector('api-console');
apic.selectedShape = 'summary';
```

#### selectedShapeType

Type: **string**

Currently selected object type.

It can be one of:

-   `summary` - API summary view
-   `documentation` - RAML's API documentation node
-   `type` - Model documentation (type, schema)
-   `security` - Security scheme documentation
-   `endpoint` - Endpoint documentation
-   `method` - Method documentation

See section [Controlling the view](#controlling-the-view) section below for more information.

```html
<api-console selectedshapetype="summary"></api-console>
```

```javascript
const apic = document.querySelector('api-console');
apic.selectedShapeType = 'summary';
```

#### modelLocation

Type: **String**

Location of the file with generated AMF model to automatically download when this value change.
This can be used to optimise start up time by not producing AMF model from your API spec each time the console is opened.

```html
<api-console modellocation="static/api/api-model.json"></api-console>
```

#### appendHeaders

Type: **String**

Forces the console to send a specific list of headers, overriding user input if needed.
The attribute value passes an HTTP headers string separating lines with the `\n` character.

```html
<api-console appendheaders="x-api-token: abc\nx-other-headers: header value"></api-console>
```

#### proxy

Type: **String**

Sets the proxy URL for the HTTP requests sent from the console.
When set each request is sent to the proxy service instead of the final request URL.
The request URL is added to the end of the proxy string. Use with combination with
`proxy-encode-url` to encode URL value.

```html
<api-console proxy="https://api.service.proxy/?u="></api-console>
```

This sends the request to the proxy service that would look like this:

`https://api.service.proxy/?u=https://api.domain.com/endpoint`

#### proxyEncodeUrl

Type: **String**

To be used when `proxy` is set. The value appended to the proxy URL is url encoded.

```html
<api-console proxy="https://api.service.proxy/?u=" proxyencodeurl></api-console>
```

This sends the request to the proxy service that would look like this:

`https://api.service.proxy/?u=https%3A%2F%2Fapi.domain.com%2Fendpoint`

#### manualNavigation

Type: **Boolean**

Disables navigation support in the UI. When set the navigation has to be supported programmatically.
Use in the narrow layouts with the `narrow` attribute. Set `navigation-opened` property to `true` or `false` to control the navigation.

```html
<api-console manualnavigation narrow></api-console>
```

```javascript
const apic = document.querySelector('api-console');
apic.navigationOpened = true;
```

#### scrollTarget

Type: **Element**

Some documentation components (like endpoint documentation) uses this property to control the scroll position.
By default it uses `window` object. When API console is used inside a scroll area use the area element.

```javascript
const apic = document.querySelector('api-console');
apic.scrollTarget = apic.parentElement;
```

#### redirectUri

Type: **String**

OAuth2 redirect URI.

See documentation for `advanced-rest-client/oauth-authorization` for API details.

```html
<api-console redirecturi="https://my.api.domain/oauth/popup.html"></api-console>
```

#### baseUri

Type: **String**

Used to replace API's base URI. Once set it updates the request URL in the request panel (try it).
The URL will always contain the same base URL until the attribute is cleared (removed, set to `null`, `undefined` or `false`).

The request URL is a combination of base uri and endpoint's path.

```html
<api-console baseuri="https://proxy.api.com/endpoint"></api-console>
```

#### eventsTarget

Type: **Element**

A HTML element used to listen for events on.
If you use one than more API console elements on single page at the same time wrap the console is a HTML element (eg div) and set this value to the container so the request panel only listen to events dispatched inside the container. Otherwise events dispatched by the request panel will be handled by other instances of the console.

```html
<div id="target1">
  <api-console events-target="target1"></api-console>
</div>
<div id="target2">
  <api-console events-target="target2"></api-console>
</div>
```
Note: API console won't recognize string value as an ID of an element. You have to pass this value programmatically.

### Layout control attributes

#### page

Type: **String**

Currently selected top level view of the console. Can be either `docs` or `request`. The latter is the "try it" screen. This property changes at runtime when the user navigates through the application.

This can be useful when changing API model dynamically to reset the console to the default state.

```javascript
const apic = document.querySelector('api-console');
apic.page = 'docs';
apic.selectedShape = 'summary';
apic.selectedShapeType = 'summary';
```

#### app

Type: **Boolean**

==Deprecated but set it for apps==

When set it renders API console as a stand-alone application.
Setting this option adds automation like handling media queries and sets mobile friendly styles.

```html
<api-console app></api-console>
```

#### narrow

Type: **Boolean**

Renders the API console in the mobile friendly view.
Navigation is hidden and some views are simplified for narrow screens. This view is presented even if the screen is wide enough to display the full console, which facilitates inserting the element as a sidebar of your web page. The `narrow` property is set automatically on mobile devices when `app` property is set.

```html
<api-console narrow></api-console>
```

#### widelayout

Type: **Boolean**

When set it places try it panel next to the documentation panel. It is set automatically via media queries when `app` attribute is set.

```html
<api-console widelayout></api-console>
```

#### noTryIt

Type: **Boolean**

Disables the "try it" button in the method documentation view.
The request editor and the response viewer is still available, but it must be opened programmatically by setting `page` property to ` request`.
When `app` is set and `wide-layout` is computed to be true then it is automatically set to true as the request panel is rendered next to the documentation.

```html
<api-console notryit></api-console>
```

#### navigationOpened

Type: **Boolean**

Works when `manualNavigation` attribute is set. Toggles navigation state.

```javascript
const button = document.querySelector('.nav-toggle-button');
button.addEventListener('click', () => {
  const apic = document.querySelector('api-console');
  apic.navigationOpened = !apic.navigationOpened;
});
```

#### noUrlEditor

Type: **Boolean**

If set, the URL editor is hidden in the try it panel.
The editor is still attached to the DOM but it is not invisible to the user.

```html
<api-console nourleditor></api-console>
```

#### drawerAlign

Type: **String**

Alignment of the navigation drawer. Possible values are: `start` and `end`.

```html
<api-console draweralign="end"></api-console>
```

#### inlineMethods

Type: **Boolean**

Experimental feature. Always renders the try it panel alongside method documentation. Methods for an endpoint are rendered in a single page instead of separated pages

```html
<api-console inlinemethods></api-console>
```

#### allowDisableParams

Type: **Boolean**

Option passed to the try it panel. When set it allows to disable parameters in an editor (headers, query parameters). Disabled parameter won't be used with a test call but won't be removed from the UI.

```html
<api-console allowdisableparams></api-console>
```

#### allowCustom

Type: **Boolean**

Option passed to the try it panel. When set, editors renders "add custom" button that allows to define custom parameters next to API spec defined.

```html
<api-console allowcustom></api-console>
```

#### allowHideOptional

Type: **Boolean**

Option passed to the try it panel. Enables auto hiding of optional properties (like query parameters or headers) and renders a checkbox to render optional items in the editor view.

```html
<api-console allowhideoptional></api-console>
```

#### noDocs

Type: **Boolean**

Prohibits rendering documentation (the icon and the description) in request editors.

```html
<api-console nodocs></api-console>
```

#### rearrangeEndpoints

Type: **Boolean**

This property is passed to the `api-navigation` component.

When this value is set, the navigation component sorts the list of endpoints based on the `path` value of the endpoint, keeping the order of which endpoint was first in the list, relative to each other.

**This is an experimental option and may disappear without warning.**

## Controlling the view

The `<api-console>` uses `selectedShape`, `selectedShapeType`, and `page` properties to control the view.
The `page` property displays top level pages as documentation or try it screen. The `selectedShape` informs the components which AMF node to use to render the view. It is the `@id` property of the JSON+ld data model. Finally `selectedShapeType` tells the documentation element which view to render.

The `selectedShape` property can have the following values:

-   `summary` - Summary of the API spec
-   `docs` - Documentation included in the spec
-   `type` - Type
-   `resource` - Endpoint documentation
-   `method` - Method
-   `security` - Security scheme documentation

Normally API console passes `selectedShape` and `selectedShapeType` values from `api-navigation` to `api-documentation` and `api-request-panel` when navigation occurred. However it can be set programmatically to control the view.

[raml-aware]: https://elements.advancedrestclient.com/elements/raml-aware
