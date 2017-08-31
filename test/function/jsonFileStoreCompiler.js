'use strict';

let FileStore = require('../../lib/server/context/store/fileStore');
let JSONStoreCompiler = require('../../lib/server/context/store/fileStoreCompiler/json');
let path = require('path');
let del = require('del');
let assert = require('assert');

const TEST_DIR = path.join(__dirname, '../fixture/fileStore/test');
const TEST_FILE = path.join(TEST_DIR, 'test2.json');

describe('jsonFileStoreCompiler', () => {
    it('base', async() => {
        let {
            query,
            update
        } = FileStore({
            cacheInMemory: true,
            completeDir: true,
            compiler: JSONStoreCompiler()
        });

        let updateA = update('.a=vara');
        let queryA = query('.a');

        await del([TEST_DIR]);
        await updateA(TEST_FILE, {
            vara: 10
        });
        let cnt = await queryA(TEST_FILE);
        assert.equal(cnt, 10);
    });

    it('remove', async() => {
        let {
            query,
            update
        } = FileStore({
            cacheInMemory: true,
            completeDir: true,
            compiler: JSONStoreCompiler({
                defaultFileContentObj: {
                    a: {
                        b: 100
                    }
                }
            })
        });

        let removeB = update('- .a.b');
        let queryAB = query('.a.b');

        await del([TEST_DIR]);
        await removeB(TEST_FILE);
        let cnt = await queryAB(TEST_FILE);
        assert.equal(cnt, undefined);
    });
});
