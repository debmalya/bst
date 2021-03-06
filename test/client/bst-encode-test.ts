/// <reference path="../../typings/index.d.ts" />

import * as assert from "assert";
import {BSTEncode} from "../../lib/client/bst-encode";

const awsAccessKeyId = process.env["AWS_ACCESS_KEY_ID"];
const awsSecretAccessKey = process.env["AWS_SECRET_ACCESS_KEY"];

describe("BSTEncode", function() {

    describe("#encodeAndPublishURL()", function() {
        it("Encodes and Publishes a URL", function (done) {
            if (doNotRun(this, done)) return;
            this.timeout(10000);

            const config = {
                bucket: "bespoken-encoding-test",
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey
            };

            let encoder = new BSTEncode(config);
            encoder.encodeURLAndPublish("https://s3.amazonaws.com/xapp-alexa/UnitTestOutput.mp3", function(error: Error, url: string) {
                assert(!error);
                assert(url, "https://s3.amazonaws.com/bespoken-encoding-test/UnitTestOutput-encoded.mp3");
                done();
            });
        });

        it("Encodes and Publishes a URL as another name", function (done) {
            if (doNotRun(this, done)) return;
            this.timeout(10000);

            const config = {
                bucket: "bespoken-encoding-test",
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey
            };

            let encoder = new BSTEncode(config);
            encoder.encodeURLAndPublishAs("http://traffic.libsyn.com/bespoken/Introduction.mp3", "UNIT_TEST_INTRODUCTION.mp3", function(error: Error, url: string) {
                assert(!error);
                assert(url, "https://s3.amazonaws.com/bespoken-encoding-test/UNIT_TEST_INTRODUCTION.mp3.mp3");
                done();
            });
        });

        it("Encodes and Publishes a URL that is m4a", function (done) {
            if (doNotRun(this, done)) return;
            this.timeout(10000);

            const config = {
                bucket: "bespoken-encoding-test",
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey
            };

            let encoder = new BSTEncode(config);
            encoder.encodeURLAndPublish("https://s3.amazonaws.com/bespoken-encoding-test/ContentPromoPromptGood.m4a", function(error: Error, url: string) {
                console.log(error);
                assert(!error);
                assert.equal(url, "https://s3.amazonaws.com/bespoken-encoding-test/ContentPromoPromptGood-encoded.mp3");
                done();
            });
        });

        it("Tries to encode bad URL", function (done) {
            if (doNotRun(this, done)) return;

            const config = {
                bucket: "bespoken-encoding-test",
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey
            };

            let encoder = new BSTEncode(config);
            encoder.encodeURLAndPublish("https://s3.amazonaws.com/xapp-alexa/UnitTestNotThere.mp3", function(error: Error, url: string) {
                assert(error);
                done();
            });
        });
    });

    describe("#encodeAndPublishFile()", function() {
        it("Encodes and Publishes a file", function (done) {
            this.timeout(10000);
            if (doNotRun(this, done)) return;

            const config = {
                bucket: "bespoken-encoding-test",
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey
            };

            let encoder = new BSTEncode(config);
            encoder.encodeFileAndPublish("test/resources/ContentPromoPrompt.m4a", function (error: Error, url: string) {
                assert(!error);
                assert(url, "https://s3.amazonaws.com/bespoken-encoding-test/ContentPromoPrompt-encoded.mp3");
                done();
            });
        });
    });
});

function doNotRun(test: any, done: Function): boolean {
    if (awsAccessKeyId === undefined || awsSecretAccessKey === undefined) {
        console.warn("AWS dependent test skipped. AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables must be set for these tests");
        done();
        return true;
    }
}
