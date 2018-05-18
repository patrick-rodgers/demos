## pnpjs-spfx-1-4-1-appcustheader

This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO

## Debug Query String

?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&customActions={"dd663812-eafe-40fd-8e66-8ea90a9496da":{"location":"ClientSideExtension.ApplicationCustomizer","properties":{}}}
