# subresource [![Build Status](https://travis-ci.org/neftaly/npm-subresource.svg?branch=master)](https://travis-ci.org/neftaly/npm-subresource)

This tool is designed to make using [sub-resource integrity](https://srihash.org/) in your Node app super-simple.

**SemVer note:** As the SRI spec has not yet been finalized, minor releases < 1.0.0 can contain breaking changes.

Install
-------
```shell
npm install --save subresource
```

Usage
-----
```js
var subresource = require("subresource");

// ES6 template string
var element = `<link
    href="/style.css"
    integrity="${ subresource("../public/style.css").integrity }"
    rel="stylesheet">`;
```

Other libraries:
 * [handlebars-helper-sri](https://github.com/neftaly/handlebars-helper-sri)

Caching
-------
All resources are cached on first hit. This introduces a once-off blocking delay.

### Preload
The synchronous delay shouldn't be a significant issue, however you can always pre-load.
```js
var subresource = require("subresource"),
    Hapi = require("hapi");

// First hit - blocks while generating SRI
[
    "../public/script.js",
    "../public/style.css"
].forEach(subresource); // Load files into cache

var server = new Hapi.Server(3000);
server.route({
    method: "GET",
    path: "/",
    handler: function(request, reply) {

        // Second hit - loads immediately from cache
        reply(
            `<link href="/style.css"
            integrity="${ subresource("../public/style.css").integrity }"
            rel="stylesheet">`
        );

    }
});
server.route({
    method: "GET",
    path: "{param*}",
    handler: {
        directory: {
            path: "public"
        }
    }
});
server.start(function() {
    console.log('Listening at http://localhost:3000');
});
```

### subresource.cache
To force refresh of resource on next hit:
```js
subresource.cache.kill("./relative/file/path");
```

To directly access the internal cache object:
```js
// Resources are indexed internally by absolute path.
subresource.cache.internal //=> { "/absolute/file/path": { integrity: "XXXX", age: 1234567890 } }
```