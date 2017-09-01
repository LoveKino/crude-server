'use strict';

let FileStore = require('./fileStore');
let JSONStoreCompiler = require('./fileStoreCompiler/json');

let toApi = (names = [], fn) => (filePath, ...args) => {
    let variableMap = names.reduce((prev, name, index) => {
        prev[name] = args[index];
        return prev;
    }, {});

    return fn(filePath, variableMap);
};

/**
 * apiMap = {
 *   [name]: {
 *      type: 'query' | 'update',
 *      script, // '.a.b.c = var1'
 *      paramNames, // ['var1']
 *      variableStub
 *   }
 * }
 *
 * Used to generate some common apis for file store
 */
module.exports = ({
    apiMap = {},
    fileStoreCompiler = JSONStoreCompiler
} = {}) => {
    let {
        query,
        update
    } = FileStore({
        cacheInMemory: true,
        completeDir: true,
        compiler: fileStoreCompiler()
    });

    let apis = {};
    for (let name in apiMap) {
        let {
            type = 'query', paramNames, script, variableStub
        } = apiMap[name];

        let exe = type === 'update' ? update : query;

        apis[name] = toApi(paramNames, exe(script, {
            variableStub
        }));
    }

    return apis;
};
