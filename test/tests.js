"use strict";

const assert = require("assert");
const path = require("path");
const subresource = require("..");
const fs = require("fs-sync");

const tempFixture = path.join(__dirname, "./fixtures/temp/jquery-1.10.2.min.js");

describe("Generate:", () => {
    before(done => {
        fs.remove(tempFixture) // remove the temp file if it exists
        done();
    });
    after(done => {
        fs.remove(tempFixture) // remove the temp file if it exists
        done();
    });

    beforeEach(done => {
        fs.copy(path.join(__dirname, "./fixtures/jquery-1.10.2.min.js"), tempFixture);
        done();
    });

    describe("defaults:", () => {
        const expect = {
            hashes: {
                sha384: "hK8q2gkBjirpIGHAH+sgqYMv6i6mfx2JVZWJ50jyYhkuEHASU6AS1UTWSo32wuGL"
            },
            integrity: "sha384-hK8q2gkBjirpIGHAH+sgqYMv6i6mfx2JVZWJ50jyYhkuEHASU6AS1UTWSo32wuGL"
        };

        it("Initial hit", () => {
            const result = subresource(tempFixture);
            assert.deepStrictEqual(expect, result);
        });

        it("Cached hit", () => {
            fs.remove(tempFixture); // Make sure it can't re-load the fixture
            const result = subresource(tempFixture);
            assert.deepStrictEqual(expect, result);
        });
    });

    describe("sha256:", () => {
        const options = { algorithms: ["sha256"] };
        const expect = {
            hashes: {
                sha256: "C6CB9UYIS9UJeqinPHWTHVqh/E1uhG5Twh+Y5qFQmYg="
            },
            integrity: "sha256-C6CB9UYIS9UJeqinPHWTHVqh/E1uhG5Twh+Y5qFQmYg="
        };

        it("Initial hit", () => {
            const result = subresource(tempFixture, options);
            assert.deepStrictEqual(expect, result);
        });

        it("Cached hit", () => {
            fs.remove(tempFixture); // Make sure it can't re-load the fixture
            const result = subresource(tempFixture, options);
            assert.deepStrictEqual(expect, result);
        });
    });

    describe("invalid:", () => {
        const options = { algorithms: ["sha256", "sha384"] };

        it("Error", () => {
            const result = () => subresource(tempFixture, options);
            assert.throws(result, "Error: options.algorithms should include only one algorithm!");
        });
    });
});
