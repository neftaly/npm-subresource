/*
    subresource
*/

"use strict";

const fs = require("fs");
const path = require("path");
const sri = require("sri-toolbox").generate;
const memoize = require("fast-memoize");

const defaults = {
    algorithms: ["sha384"]
};

// Load file, and build SRI
const generate = memoize((filePath, options) => {
    options = { ...defaults, ...options };
    options.full = true; // Always set `full: true`

    if (options.algorithms.length > 1) {
        throw new Error(`options.algorithms should include only one algorithm!`);
    }

    const data = fs.readFileSync(filePath);
    return sri(options, data);
});


// Resolve file path, and request SRI
module.exports = memoize((filePath, options) => {
    filePath = path.resolve(filePath);
    return generate(filePath, options);
});
