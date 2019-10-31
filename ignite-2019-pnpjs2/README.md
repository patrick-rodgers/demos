## ignite-2019-pnpjs-2

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

# Demo Script

Big points:

- [Selective imports](https://pnp.github.io/pnpjs/documentation/v2-beta/concepts/selective-imports/) allow for smaller bundles - don't want the hassle you can use a preset
- [Invokables](https://pnp.github.io/pnpjs/documentation/v2-beta/concepts/invokable/)


1. Note one line install for @pnp/sp (no longer need to include all peer dependencies)
   
   `npm install @pnp/sp@beta`
2. File: [HelloWorldWebPart.ts](src\webparts\helloWorld\HelloWorldWebPart.ts)
   - Note: Added [selective imports](https://pnp.github.io/pnpjs/documentation/v2-beta/concepts/selective-imports/) at top of file
   - Simple paths to sub-modules (@pnp/sp/webs for example)
   - Added onInit as before, no changes from v1 for setup
   - Note invokable, no need to use ".get" method

