"use strict";

var assert = require("assert"),
    subresource = require("../main"),
    path = require("path");


describe("Generate:", function () {

    var filePath = "./test/jquery-1.10.2.min.js.testdata";
    var absolutePath = path.resolve(filePath);
    var expect = {
        integrity: "sha256-C6CB9UYIS9UJeqinPHWTHVqh/E1uhG5Twh+Y5qFQmYg=",
        age: "PLACEHOLDER"
    };

    var firstResultTime;

    it("Initial hit", function () {
        var result = subresource(filePath);

        expect.age = result.age; // IMPURE VALUE!
        assert.deepEqual(expect, result);
    });

    it("Cached hit", function () {
        this.timeout(100);

        var result = subresource(filePath);
        // age should not have changed
        assert.deepEqual(expect, result);
    });

    it("Cache age", function () {
        assert.equal("number", typeof subresource.cache.internal[absolutePath].age);
    });

    it("Kill cache", function () {
        subresource.cache.kill(filePath);

        var result = subresource(filePath);
        assert.equal(true, (expect.age !== result.age));
    });

});
