/**
 * Created by jpk on 7/1/16.
 */
/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/node/index.d.ts" />

import * as assert from "assert";

import {BespokeClient} from '../../client/bespoke-client';
import {NodeConnection} from "../../service/node-connection";
import {NodeManager} from '../../service/node-manager';

describe('NodeManager', function() {
    describe('Connect', function() {
        it('Should Connect and Receive Data', function(done) {
            let handler = new NodeManager(9999);
            let client = new BespokeClient("localhost", 9999);

            handler.onConnect = function (connection: NodeConnection) {
                assert.equal("127.0.0.1", connection.remoteAddress());
            };

            handler.onReceive = function(connection, data) {
                console.log("OnReceive: " + data);
                assert.equal("127.0.0.1", connection.remoteAddress());
                assert.equal("I am Chuck Norris!", data);
                client.disconnect();
            };

            handler.onClose = function() {
                done();
            };

            handler.start();

            client.connect();
            client.write("I am Chuck Norris!", null);
            //client.disconnect();
            //assert.ok(true);
        });
    });
});