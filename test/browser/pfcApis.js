'use strict';

let pfcApis = require('../../lib/web/pfcApis');
let assert = require('assert');

let {
    apiMap,
    runApi
} = pfcApis('/api/pfc', {
    add: {
        type: 'function',
        validateParamItem: (paramValue, index) => {
            if (index === 0) {
                if (typeof paramValue !== 'number') {
                    throw new Error('expect number');
                }
            }
        }
    }
});

let base = () => {
    return runApi(apiMap.add(1, 2)).then((ret) => {
        assert.equal(ret, 3);
    });
};

let error = () => {
    return runApi(apiMap.add('123', 45)).catch(err => {
        assert.equal(err.toString(), 'Error: expect number');
        return 1;
    }).then((ret) => {
        assert.equal(ret, 1);
    });
};

let composeError = () => {
    return runApi(apiMap.add(4, apiMap.add('12', 9))).catch(err => {
        assert.equal(err.toString(), 'Error: expect number');
        return 1;
    }).then((ret) => {
        assert.equal(ret, 1);
    });
};

module.exports = Promise.all([
    base(),
    error(),
    composeError()
]);
