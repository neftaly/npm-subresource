# subresource

[![Build Status](https://travis-ci.org/neftaly/npm-subresource.svg?branch=master)](https://travis-ci.org/neftaly/npm-subresource)
[![Coverage Status](https://coveralls.io/repos/neftaly/npm-subresource/badge.svg?branch=master)](https://coveralls.io/r/neftaly/npm-subresource?branch=master)
[![Dependencies Status](https://david-dm.org/neftaly/npm-subresource.svg)](https://david-dm.org/neftaly/npm-subresource)
[![Dev Dependencies Status](https://david-dm.org/neftaly/npm-subresource/dev-status.svg)](https://david-dm.org/neftaly/npm-subresource?type=dev)

This tool generates file hashes & [sub-resource integrity](https://www.srihash.org/) data at runtime.

## Install

```shell
npm install --save subresource
```

## Usage

```js
var subresource = require("subresource");

// ES6 template string
var element = `<link
    href='/style.css'
    integrity='${ subresource("../public/style.css").integrity }'
    rel='stylesheet'>`;
```

For improved performance, use client-side caching:

```js
var styleSri = subresource("../public/style.css");
var element = `<link
    href='/style.css?cache=${ styleSri.hashes.sha256 }'
    integrity='${ styleSri.integrity }'
    rel='stylesheet'>`;
```

`/style.css?hash=[...]` headers:

```text
Cache-Control: public, max-age=31536000
```

## Preload

Subresource operates at run-time, and caches lookups internally.
There is, however, a one-time blocking delay whenever a new resource is encountered.

Pre-loading moves this delay from the event loop to init.

**Note:** Pre-loading (or the planned async mode) is generally unnecessary.
Also consider a build-time tool such as [grunt-sri](https://github.com/neftaly/grunt-sri).

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
            `<link href='/style.css'
            integrity='${ subresource("../public/style.css").integrity }'
            rel='stylesheet'>`
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

## Semver

This tool follows Semver from v0.1.0, however it is important to note that the [SRI](https://www.w3.org/TR/SRI/) spec is still in draft.

Changes to the v1 SRI spec will be tracked with minor releases.

Releases < 0.1.0 may contain breaking changes, nuts, and traces of soy.

## Other libraries

* [grunt-sri](https://github.com/neftaly/grunt-sri)
* [handlebars-helper-sri](https://github.com/neftaly/handlebars-helper-sri)
