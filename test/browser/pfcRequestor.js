'use strict';

let pfcRequestor = require('../../lib/web/pfcRequestor');
let assert = require('assert');

let request = pfcRequestor('/api/pfc');

let base = () => {
    return request('add(1, 2)').then((ret) => {
        assert.equal(ret, 3);
    });
};

let error = () => {
    return request('error()').catch(err => {
        assert.equal(err.toString(), 'Error: 123');
        return 1;
    }).then((ret) => {
        assert.equal(ret, 1);
    });
};

module.exports = Promise.all([
    base(),
    error()
]);
