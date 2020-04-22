"use strict";

var assert = require("assert"),
    path = require("path"),
    subresource = require(".."),
    fs = require("fs-sync");

var tempFixture = path.join(__dirname, "./fixtures/temp/jquery-1.10.2.min.js");

describe("Generate:", function () {
    beforeEach(function (done) {
        fs.copy(path.join(__dirname, "./fixtures/jquery-1.10.2.min.js"), tempFixture);
        done();
    });

    describe("sha256:", function () {
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

    describe("sha384:", function () {
        var options = { algorithms: ["sha384"] };
        var expect = {
            hashes: {
                sha384: "hK8q2gkBjirpIGHAH+sgqYMv6i6mfx2JVZWJ50jyYhkuEHASU6AS1UTWSo32wuGL"
            },
            type: undefined,
            integrity: "sha384-hK8q2gkBjirpIGHAH+sgqYMv6i6mfx2JVZWJ50jyYhkuEHASU6AS1UTWSo32wuGL"
        };

        it("Initial hit", function () {
            var result = subresource(tempFixture, options);
            assert.deepEqual(expect, result);
        });

        it("Cached hit", function () {
            fs.remove(tempFixture); // Make sure it can't re-load the fixture
            var result = subresource(tempFixture, options);
            assert.deepEqual(expect, result);
        });
    });
});
