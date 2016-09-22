'use strict';

let crude = require('..');

let requestor = require('cl-requestor');
let httpRequest = requestor('http');
let assert = require('assert');

describe('index', () => {
    it('base', () => {
        let {
            start, stop
        } = crude((pathname) => {
            if (pathname === '/api/hello') {
                return (req, res) => {
                    res.end('12345');
                };
            }
        });

        return start(8000).then(() => {
            return httpRequest({
                hostname: '127.0.0.1',
                port: 8000,
                path: '/api/hello'
            }).then(({
                body
            }) => {
                assert.equal(body, '12345');
                return stop();
            });
        });
    });
});
