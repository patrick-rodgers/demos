## pnpscope-demo

Shows using the beta @pnp packages as seperate dependencies, very basic


?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&customActions={"edf1f6ca-0199-4a62-82e9-04ed269bc38e":{"location":"ClientSideExtension.ApplicationCustomizer","properties":{"testMessage":"Hello as property!"}}}

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
