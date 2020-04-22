/*
    subresource
*/

"use strict";

const fs = require("fs");
const path = require("path");
const sri = require("sri-toolbox").generate;
const memoize = require("fast-memoize");

const defaults = {
    algorithms: ["sha384"],
    full: true
};

// Load file, and build SRI
const generate = memoize((filePath, options) => {
    options = { ...defaults, ...options };
    const data = fs.readFileSync(filePath);
    return sri(options, data);
});


// Resolve file path, and request SRI
module.exports = memoize((filePath, options) => {
    filePath = path.resolve(filePath);
    return generate(filePath, options);
});
