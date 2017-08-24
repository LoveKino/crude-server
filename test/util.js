'use strict';

let crude = require('..');

let requestor = require('cl-requestor');
let httpRequest = requestor('http');

module.exports = {
    testApier: async(apier, reqOptions, reqBody, resHandler) => {
        let {
            start,
            stop
        } = crude(apier);

        await start(8000);

        let response = await httpRequest(reqOptions, reqBody);

        resHandler && resHandler(response);

        await stop();
    }
};
