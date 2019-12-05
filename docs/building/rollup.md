---
title: Building API Console with Rollup
summary: This document describes how to create an application from sources
authors:
    - Pawel Psztyc
date: 2019-12-04
---

# Rollup configuration

API Console follows [open-wc recommendations](https://open-wc.org/building/building-rollup.html) for building. We suggest to use Rollup to build a stand the application.

The build process for the API Console is a 3 step process:

1.  Create `vendor.js` package
2.  Process styling
3.  Bundle the application

You can check out our build process for API Console demo page in the [main repository](https://github.com/mulesoft/api-console/blob/6.0.0-preview/rollup.config.js).

## vendor.js bundle

API Console depends on CodeMirror and CryptoJS libraries that cannot be bundled like other modules with the console. These packages has to be embedded as a regular scripts instead of JavaScript modules. They also has to be executed before the console sources.

To bundle `vendor.js` package add `prepare` script to your `package.json` file.

```json
"prepare": "node prepare-vendor.js",
```

This bundle can be used in a developer preview of your application as well as in the final bundle. Just include generated file in the document.

```html
<head>
  <script src="./vendor.js"></script>
</head>
```

<details><summary>prepare-vendor.js</summary>
<p>

```javascript
const UglifyJS = require('uglify-js');
const fs = require('fs-extra');
const path = require('path');

const vendorName = 'vendor.js';
const distPath = path.join('dist', vendorName);

const CryptoFiles = [
  'cryptojslib/components/core.js',
  'cryptojslib/components/sha1.js',
  'cryptojslib/components/enc-base64.js',
  'cryptojslib/components/md5.js',
  'jsrsasign/lib/jsrsasign-rsa-min.js',
];

const CmFiles = [
  'jsonlint/web/jsonlint.js',
  'codemirror/lib/codemirror.js',
  'codemirror/addon/mode/loadmode.js',
  'codemirror/mode/meta.js',
  'codemirror/mode/javascript/javascript.js',
  'codemirror/mode/xml/xml.js',
  'codemirror/mode/yaml/yaml.js',
  'codemirror/mode/htmlmixed/htmlmixed.js',
  'codemirror/addon/lint/lint.js',
  'codemirror/addon/lint/json-lint.js',
];

async function prepareVendor() {
  const code = {};
  const deps = CryptoFiles.concat(CmFiles);
  for (let i = 0, len = deps.length; i < len; i++) {
    const file = deps[i];
    const full = require.resolve(file);
    code[file] = await fs.readFile(full, 'utf8');
  }

  const result = UglifyJS.minify(code);
  await fs.writeFile('vendor.js', result.code, 'utf8');


  const exists = await fs.pathExists(distPath);
  // only updates vendor package when dist already exists.
  if (exists) {
    await fs.remove(distPath);
    await fs.copy(vendorName, distPath);
  }
}

prepareVendor();
```

</p>
</details>

## Processing styles

The application comes with some default styling on the components level. If you want to style the application by yourself create a CSS file that adds variables definition. See [api-console-master-styles.css](https://github.com/mulesoft/api-console/blob/6.0.0-preview/demo/api-console-master-styles.css) for an example of such styling.

For the browser to process the styles correctly you can just include the styles like a regular style to any modern browser as CSS variables are widely supported. However, if you are targeting legacy browsers like IE 11 then you may want to include the file into the main import file and use rollup plugin to process CSS data (see next section).

```javascript
import './api-console-master-styles.css';
```

In `rollup.config.js`

```javascript
import postcss from 'rollup-plugin-postcss';
export default [
  {
    ...config[0],
    plugins: [
      postcss(),
    ],
  },
];
```

## Building configuration

Finally you can create a configuration for your project that includes API Console.
We strongly suggest to follow [open-wc recommendations](https://open-wc.org/building/building-rollup.html) for building.

Let's start with the `index.html` page. It is regular HTML page that includes `vendor.js` package, API Console bundle, and then uses the console.

<details><summary>index.html</summary>
<p>

```html
<!doctype html>
<html lang="en">
  <head>
    <script src="./vendor.js"></script>
  </head>
  <body>
    <script type="module" src="./apic-import.js"></script>
    <h1>My API page</h1>
    <api-console></api-console-app>
  </body>
</html>
```

</p>
</details>

The sources file contains import of all required dependencies.

<details><summary>apic-import.js</summary>
<p>

```javascript
import '@advanced-rest-client/oauth-authorization/oauth1-authorization.js';
import '@advanced-rest-client/oauth-authorization/oauth2-authorization.js';
import '@advanced-rest-client/xhr-simple-request/xhr-simple-request.js';
import '@anypoint-web-components/api-console/api-console.js';
import './api-console-master-styles.css';
```

</p>
</details>

Finally this our configuration for building API Console demo page.

<details><summary>rollup.config.js (modern browsers)</summary>
<p>

```javascript
import { createDefaultConfig } from '@open-wc/building-rollup';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import cpy from 'rollup-plugin-cpy';

const config = createDefaultConfig({
  input: path.join(__dirname, 'index.html'),
  indexHTMLPlugin: {
    minify: {
      minifyJS: true,
      removeComments: true,
    },
  },
});

// This is required for marked.js library to work!
config.context = 'window';

export default [
  {
    ...config,
    plugins: [
      ...config.plugins,
      postcss(),
      cpy({
        files: [
          path.join(__dirname, 'vendor.js'),
        ],
        dest: 'dist',
        options: {
          parents: false,
        },
      }),
    ],
  },
];
```

</p>
</details>

Sometimes you may need to create a legacy bundle for IE11. Our configuration for
API Console could be like the following.

<details><summary>rollup.config.js (legacy browsers)</summary>
<p>

```javascript
import { createCompatibilityConfig } from '@open-wc/building-rollup';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import cpy from 'rollup-plugin-cpy';

const config = createCompatibilityConfig({
  input: path.resolve(__dirname, 'index.html'),
  indexHTMLPlugin: {
    minify: {
      minifyJS: true,
      removeComments: true
    }
  }
});

// This is required for marked.js library to work!
config[0].context = 'window';
config[1].context = 'window';

export default [
  {
    ...config[0],
    plugins: [
      ...config[0].plugins,
      postcss()
    ]
  },
  {
    ...config[1],
    plugins: [
      ...config[1].plugins,
      postcss(),
      cpy({
        files: [
          path.join('demo', 'vendor.js'),
        ],
        dest: 'dist',
        options: {
          parents: false,
        },
      }),
    ],
  },
];
```

</p>
</details>
