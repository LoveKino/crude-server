'use strict';

let pfcApiMid = require('../../lib/pfcApiMid');

let assert = require('assert');
let {
    testApier
} = require('../util');

describe('pfcApiMid', () => {
    it('base', () => {
        return testApier((pathname) => {
            if (pathname === '/api') {
                return pfcApiMid(() => {
                    return {
                        add: (a, b) => a + b
                    };
                });
            }
        }, {
            hostname: '127.0.0.1',
            port: 8000,
            path: '/api',
            method: 'POST'
        }, 'add(4, 5)', ({
            body
        }) => {
            assert.deepEqual(JSON.parse(body), {
                'errno': 0,
                'bridge': 'pfc',
                'data': 9
            });
        });
    });

    it('error', () => {
        return testApier((pathname) => {
            if (pathname === '/api') {
                return pfcApiMid(() => {
                    return {
                        add: () => {
                            throw new Error('123');
                        }
                    };
                });
            }
        }, {
            hostname: '127.0.0.1',
            port: 8000,
            path: '/api',
            method: 'POST'
        }, 'add(4, 5)', ({
            body
        }) => {
            assert.deepEqual(JSON.parse(body), {
                'errno': -1,
                'bridge': 'pfc',
                'errMsg': 'Error: 123'
            });
        });
    });
});
