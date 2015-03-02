/*
    subresource
*/

"use strict";

var fs = require("fs"),
    path = require("path"),
    sri = require("sri-toolbox").generate,

    cache = {},
    subresource,
    kill;


subresource = function (filePath) {
    var data;

    // Turn file paths into something usable as a key
    filePath = path.normalize(filePath); // Necessary?
    filePath = path.resolve(filePath);

    // Build SRI on first hit
    if (!cache[filePath]) {
        data = fs.readFileSync(filePath);
        cache[filePath] = {
            integrity: sri({}, data),
            age: (new Date()).getTime()
        };
    }

    return cache[filePath];
};


// Delete a resource from the cache
kill = function (filePath) {
    filePath = path.normalize(filePath); // Necessary?
    filePath = path.resolve(filePath);
    delete cache[filePath];
}


// Exports
module.exports = subresource;
module.exports.cache = {
    internal: cache,
    kill: kill
};
