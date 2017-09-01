'use strict';

let SimpleFileStoreApi = require('../../lib/server/context/store/simpleFileStoreApi');
let assert = require('assert');
let path = require('path');

const TEST_FILE = path.join(__dirname, '../fixture/fileStore/test/test3.json');

describe('simpleFileStoreApi', () => {
    it('base', async() => {
        let {
            setCnt,
            getValueB
        } = SimpleFileStoreApi({
            apiMap: {
                setCnt: {
                    type: 'update',
                    script: '.a.b = 100'
                },

                getValueB: {
                    script: '.a.b'
                }
            }
        });

        await setCnt(TEST_FILE);
        let ret = await getValueB(TEST_FILE);
        assert.equal(ret, 100);
    });

    it('variable', async() => {
        let {
            setCnt,
            getValue
        } = SimpleFileStoreApi({
            apiMap: {
                setCnt: {
                    type: 'update',
                    script: '.a.b = v1;.a.c = v2',
                    paramNames: ['v1', 'v2']
                },

                getValue: {
                    script: '.a.[v]',
                    paramNames: ['v']
                }
            }
        });

        await setCnt(TEST_FILE, 10, 21);
        let ret1 = await getValue(TEST_FILE, 'b');
        assert.equal(ret1, 10);

        let ret2 = await getValue(TEST_FILE, 'c');
        assert.equal(ret2, 21);
    });

    it('stub', async() => {
        let {
            setCnt,
        } = SimpleFileStoreApi({
            apiMap: {
                setCnt: {
                    type: 'update',
                    script: '.a.b = v1;.a.c = v2',
                    paramNames: ['v1', 'v2'],
                    variableStub: {
                        v1: {
                            validate: (v) => {
                                if (v < 0) {
                                    throw new Error('v1 can not less than 0');
                                }
                            }
                        },
                        v2: {}
                    }
                }
            }
        });

        let signal = 0;
        try {
            await setCnt(TEST_FILE, -7, 21);
        } catch (err) {
            assert(err.toString().indexOf('v1 can not less than 0') !== -1);
            signal = 1;
        }

        assert.equal(signal, 1);
    });
});
