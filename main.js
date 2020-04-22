/* jslint node: true */

/*
    subresource
*/

"use strict";

var fs = require("fs"),
    path = require("path"),
    sri = require("sri-toolbox").generate,
    R = require("ramda"),

    generate,
    defaults;

defaults = {
    algorithms: ["sha256"],
    full: true
};

// Load file, and build SRI
generate = R.memoize(function (filePath, options) {
    options = R.merge(defaults, options);
    var data = fs.readFileSync(filePath);
    return sri(options, data);
});


// Resolve file path, and request SRI
module.exports = R.memoize(function (filePath, options) {
    filePath = path.resolve(filePath);
    return generate(filePath, options);
});
