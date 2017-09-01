'use strict';

let stubAsApis = require('pfc-compiler/lib/stubAsApis');
let pfcRequestor = require('./pfcRequestor');

module.exports = (apiPath, stub) => {
    let pfcRequest = pfcRequestor(apiPath);
    let apis = stubAsApis(stub);

    let apiMap = {};

    for (let name in apis) {
        let api = apis[name];
        if (typeof api === 'function') {
            apiMap[name] = (...params) => {
                let lazy = () => {
                    // resolve params first
                    let paramValues = [];
                    for (let i = 0; i < params.length; i++) {
                        let param = params[i];
                        if (isLazyFun(param)) {
                            paramValues.push(param());
                        } else {
                            paramValues.push(param);
                        }
                    }

                    return api(...paramValues);
                };

                lazy.tag = 'lazy';

                return lazy;
            };
        } else {
            apiMap[name] = api;
        }
    }

    let runApi = (exp) => {
        try {
            if (isLazyFun(exp)) {
                exp = exp();
            }
            return pfcRequest(exp.code);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        apiMap,
        runApi
    };
};

let isLazyFun = (f) => {
    return typeof f === 'function' && f.tag === 'lazy';
};
