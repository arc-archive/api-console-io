# Working with AMF model

API console does not offer parsing API file(s) to the data model. This is done by the [AMF](https://github.com/aml-org/amf) parser provided by MuleSoft.

For both stand-alone application and the web component version of API console you must set AMF generated model on `amf` property of the console. The source can a be direct result of parsing API spec file by the AMF parser or a JSON+ld model stored in a file.
For a performance reasons the later is preferred.

```html
<api-console></api-console>
<script>
{
  const model = await generateApiModel();
  const apic = document.querySelector('api-console');
  apic.amf = model;
  // reset selection
  apic.selectedShape = 'summary';
  apic.selectedShapeType = 'summary';
}
</script>
```

The `generateApiModel()` function can either get cached model or parse an API project
to the model. See [Parsing API project](parsing-amf.md) document for more information.
