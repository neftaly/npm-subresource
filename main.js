/*
    subresource
*/

/*jslint node: true */
"use strict";

var fs = require("fs"),
    path = require("path"),
    sri = require("sri-toolbox").generate,
    R = require("ramda"),

    generate;


// Load file, and build SRI
generate = R.memoize(function (filePath) {
    var data = fs.readFileSync(filePath);
    return sri({ full: true }, data);
});


// Resolve file path, and request SRI
module.exports = R.memoize(function (filePath) {
    filePath = path.resolve(filePath);
    return generate(filePath);
});
