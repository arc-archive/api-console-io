---
title: Introduction
summary: Getting started with API Console
authors:
    - Pawel Psztyc
date: 2019-11-15
---

# Introduction

API Console is a program that automatically generates documentation for an API project.

The magic starts with parsing API project with [AMF](https://github.com/aml-org/amf) parser and the result
of parsing (the model) is passed to API Console.

![API Console generation flow](images/general-data-flow.png)

The Console does not include AMF parser library. It is offered by MuleSoft as a separate, open source library.
In the advanced topics read [Parsing API project](advanced/parsing-amf.md) document to learn
how to process your API project before passing the model to the console.

API Console is a web component (web custom element). It is build on top
of web APIs so it can be used in any web environment and it works with any framework.

Special case for the API Console is when it works as stand-alone application, an API documentation portal.
The console support this scenario by adding layout and navigation support to the application.
See [Usage documentation](usage.md) for detailed information.
