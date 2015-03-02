# subresource

[![Build Status](https://travis-ci.org/neftaly/npm-subresource.svg?branch=master)](https://travis-ci.org/neftaly/npm-subresource) [![Coverage Status](https://coveralls.io/repos/neftaly/npm-subresource/badge.svg?branch=master)](https://coveralls.io/r/neftaly/npm-subresource?branch=master)

Super-simple [sub-resource integrity](https://srihash.org/) & client-side caching.


Install
-------
```shell
npm install --save subresource
```

SemVer
------
The SRI spec has not yet been finalized. Minor releases < 1.0.0 may contain breaking changes, nuts, and traces of soy.

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

For improved preformance, use caching:
```js
var styleSri = subresource("../public/style.css");
var element = `<link
    href="/style.css?${ styleSri.algorithms.sha256 }"
    integrity="${ styleSri.integrity }"
    rel="stylesheet">`; 
```

`/style.css?[hash]` headers:
```
Cache-Control: public, max-age=31536000
```

Preload
-------
Subresource operates at run-time.
Lookups are cached internally, negating the need for async operation.
There is, however, a one-time blocking delay whenever a new resource is loaded.

Pre-loading moves this delay from the event loop to init.

**Note:** 99% of the time, pre-loading is unnecessary. Use only if you are hashing hundreds of files; for thousands, try a build-time tool such as [payload](https://github.com/neftaly/payload).

```js
var subresource = require("subresource"),
    Hapi = require("hapi");

// First hit - blocks while generating
[
    "../public/script.js",
    "../public/style.css"
].forEach(subresource); // Preload files into cache

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

Other libraries
---------------
 * [handlebars-helper-sri](https://github.com/neftaly/handlebars-helper-sri)
