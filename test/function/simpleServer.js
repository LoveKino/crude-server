'use strict';

let simpleServer = require('../../lib/server/simpleServer');
let requestor = require('cl-requestor');
let httpRequest = requestor('http');
let assert = require('assert');
let path = require('path');

describe('simpleServer', () => {
    it('indexHtmlPath', async() => {
        let {
            start,
            stop
        } = simpleServer({
            indexHtmlPath: path.join(__dirname, '../fixture/simpleServer/index.txt')
        });
        await start(8000);

        let {
            body
        } = await httpRequest({
            hostname: '127.0.0.1',
            port: 8000,
            path: '/'
        });

        assert.equal(body, '123txt\n');
        await stop();
    });

    it('assetOutterDir', async() => {
        let {
            start,
            stop
        } = simpleServer({
            assetOutterDir: path.join(__dirname, '../fixture/simpleServer')
        });
        await start(8000);

        let {
            body
        } = await httpRequest({
            hostname: '127.0.0.1',
            port: 8000,
            path: '/asset/r.txt'
        });

        assert.equal(body, 'r.txt content\n');
        await stop();
    });

    it('pfcContexter', async() => {
        let {
            start,
            stop
        } = simpleServer({
            pfcContexter: () => {
                return {
                    add: (a, b) => a + b
                };
            }
        });
        await start(8000);

        let {
            body
        } = await httpRequest({
            hostname: '127.0.0.1',
            port: 8000,
            method: 'POST',
            path: '/api/pfc'
        }, 'add(1, 2)');

        assert.deepEqual(JSON.parse(body), {
            'errno': 0,
            'bridge': 'pfc',
            'data': 3
        });
        await stop();
    });

    it('rest', async() => {
        let {
            start,
            stop
        } = simpleServer({
            rest: (req, res) => res.end('hello')
        });
        await start(8000);

        let {
            body
        } = await httpRequest({
            hostname: '127.0.0.1',
            port: 8000,
            path: '/another'
        });

        assert.deepEqual(body, 'hello');
        await stop();
    });
});
