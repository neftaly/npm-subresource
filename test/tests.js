"use strict";

var assert = require("assert"),
    subresource = require("../main"),
    fs = require("fs-sync");


describe("Generate:", function () {
    var tempFixture = "./test/fixtures/temp/jquery-1.10.2.min.js";
    fs.copy("./test/fixtures/jquery-1.10.2.min.js", tempFixture);

    var expect = {
        hashes: {
            sha256: "C6CB9UYIS9UJeqinPHWTHVqh/E1uhG5Twh+Y5qFQmYg="
        },
        type: undefined,
        integrity: "sha256-C6CB9UYIS9UJeqinPHWTHVqh/E1uhG5Twh+Y5qFQmYg="
    };

    it("Initial hit", function () {
        var result = subresource(tempFixture);
        assert.deepEqual(expect, result);
    });

    it("Cached hit", function () {
        fs.remove(tempFixture); // Make sure it can't re-load the fixture
        var result = subresource(tempFixture);
        assert.deepEqual(expect, result);
    });


});
