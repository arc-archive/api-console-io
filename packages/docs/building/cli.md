# API Console CLI

API Console CLI is a tool to bundle API Console stand-alone application, (re)generate API model, and to preview the console's UI in a development server before serving it in your web server.

The `api-console` command __version >= 2.0.0__ works with API Console _version 6_. Previous versions of API Console are not supported by this tool.

## Usage

Install the tool globally (if possible, it requires administrative privileges in some cases)

```sh
npm i -g api-console-cli
```

macOS and Linux users should add `sudo` prefix to the command.

### Building API Console application

Syntax:

```sh
api-console build -t TYPE [options] FILE
```

The two required parameters is `-t` which describes the type of the API to process and the location of the API main file.

The type has to be one of the [supported API formats](../advanced/parsing-amf.md).

By default the tool will choose `application/yaml` media type when processing an API. It works with RAML and OAS 3 (YAML) files. However, when processing OAS 2/3 JSON based APIs then specify `-m` parameter with `application/json` media type. For example:

```sh
api-console build -t "OAS 2.0" -m "application/json" api.json
```

The `FILE` can be either a local file or it can be a remote file that is located on accessible from your computer web server. `FTP` is not supported. For example:

```sh
api-console build -t "RAML 1.0" https://domain.com/api.raml
```

To provide own theme definition that replaces default styles define the `--theme` parameter that points to the css file to be used in the bundle.

```sh
api-console build --theme "styles.css" -t "RAML 1.0" https://domain.com/api.raml
```

See full list of available options by running help command:

```sh
api-console build --help
```

### Previewing bundled console

The CLI tool has build-in web server that allows to preview the generated bundle. The server does not apply any transformations to generated sources so it will behave as any other web server.

Syntax:

```sh
api-console serve [options] [LOCATION]
```

When the console was built in the current directory just run `api-console serve` command. It checks whether `build` directory exists in current location (default build output directory) and if so then it serves content from this folder. Otherwise it serves content from current directory.
Alternatively specify the `LOCATION` parameter to point to the server root directory.

```sh
api-console serve output/directory
```

### (Re)generating API data model

Syntax:

```sh
api-console generate-json -t TYPE [options] FILE
```

This command allows to generate `api-model.json` file. API processing options (`FILE`, `-t`, `-m`) are the same as for `build` command.

## Detailed output

It is possible to output debug information of what the tool is doing by passing `--verbose` option. Currently only `build` command prints debug messages.
