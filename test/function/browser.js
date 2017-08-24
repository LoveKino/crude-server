'use strict';

let browserJsEnv = require('browser-js-env');
let promisify = require('es6-promisify');
let fs = require('fs');
let path = require('path');
let pfcApiMid = require('../../lib/pfcApiMid');

let readFile = promisify(fs.readFile);

let runFileInBrowser = async(file) => {
    let str = await readFile(file);
    await browserJsEnv(str, {
        testDir: path.join(path.dirname(file), `../../__test/${path.basename(file)}`),
        clean: true,

        apiMap: {
            '/api/pfc': pfcApiMid(() => {
                return {
                    add: (a, b) => a + b,
                    error: () => {
                        throw new Error('123');
                    }
                };
            })
        }
    });
};

let testFiles = {
    'pfcRequestor': path.join(__dirname, '../browser/pfcRequestor.js'),
};

describe('crude-server:browser', () => {
    for (let name in testFiles) {
        it(name, () => {
            return runFileInBrowser(testFiles[name]);
        });
    }
});
