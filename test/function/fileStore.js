'use strict';

let FileStore = require('../../lib/server/context/store/fileStore');
let path = require('path');
let del = require('del');
let assert = require('assert');

const TEST_DIR = path.join(__dirname, '../fixture/fileStore/test');
const TEST_FILE = path.join(TEST_DIR, 'test.txt');

describe('fileStore', () => {
    it('base', async() => {
        let {
            query
        } = FileStore({
            cacheInMemory: true,
            completeDir: true
        });

        await del([TEST_DIR]);
        let cnt = await query()(TEST_FILE);
        assert.equal(cnt, '');
    });

    it('defaultFileContentObj', async() => {
        let {
            query
        } = FileStore({
            cacheInMemory: true,
            completeDir: true,
            compiler: {
                defaultFileContentObj: 'abc'
            }
        });

        await del([TEST_DIR]);
        let cnt = await query()(TEST_FILE);
        assert.equal(cnt, 'abc');
    });

    it('update-default', async() => {
        let {
            update,
            query
        } = FileStore({
            cacheInMemory: true,
            completeDir: true,
            compiler: {
                defaultFileContentObj: 'abc'
            }
        });

        await del([TEST_DIR]);
        await update()(TEST_FILE, 'ude');
        let cnt = await query()(TEST_FILE);
        assert.equal(cnt, 'ude');
    });


    it('update', async() => {
        let {
            update,
            query
        } = FileStore({
            cacheInMemory: true,
            completeDir: true,
            compiler: {
                defaultFileContentObj: 'abc',
                updateCompiler: (fn) => (v) => fn(v)
            }
        });

        await del([TEST_DIR]);
        await update((text) => text + '2')(TEST_FILE);
        let cnt = await query()(TEST_FILE);
        assert.equal(cnt, 'abc2');
    });

    it('serialize & deserialize', async() => {
        let {
            query,
            update
        } = FileStore({
            cacheInMemory: true,
            completeDir: true,
            compiler: {
                defaultFileContentObj: {
                    a: 1
                },
                serialize: JSON.stringify,
                deserialize: JSON.parse,
                updateCompiler: (fn) => (v) => fn(v)
            }
        });

        await del([TEST_DIR]);
        let cnt = await query()(TEST_FILE);
        assert.deepEqual(cnt, {
            a: 1
        });

        await update((v) => {
            v.b = 3;
            return v;
        })(TEST_FILE);

        cnt = await query()(TEST_FILE);
        assert.deepEqual(cnt, {
            a: 1,
            b: 3
        });
    });
});
