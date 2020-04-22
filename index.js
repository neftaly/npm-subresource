/* jslint node: true */

/*
    subresource
*/

"use strict";

const fs = require("fs");
const path = require("path");
const sri = require("sri-toolbox").generate;
const R = require("ramda");

const defaults = {
    algorithms: ["sha384"],
    full: true
};

// Load file, and build SRI
const generate = R.memoize((filePath, options) => {
    options = R.merge(defaults, options);
    const data = fs.readFileSync(filePath);
    return sri(options, data);
});


// Resolve file path, and request SRI
module.exports = R.memoize((filePath, options) => {
    filePath = path.resolve(filePath);
    return generate(filePath, options);
});
