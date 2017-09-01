'use strict';

/**
 * a simple and fast web server
 */

let crudeServer = require('../..');
let chain = require('./chain');
let MidResponse = require('./midResponse');
let publicDir = require('./simple/publicDir');
let publicFile = require('./simple/publicFile');
let pfcApiMid = require('./pfcApiMid');

let {
    truth,
    startsWith
} = require('./match');

let emptyPFCContexter = () => {
    return {};
};

module.exports = ({
    log,
    indexPath = '/',
    assetPrefix = '/asset',
    pfcApiPath = '/api/pfc',

    pfcContexter = emptyPFCContexter,
    pfcVariableStub,

    indexHtmlPath,
    assetOutterDir, // parent directory of asset directory

    rest
}) => {
    let {
        runTimeError
    } = MidResponse(log);

    return crudeServer(
        chain([
            indexHtmlPath && [indexPath, runTimeError(publicFile({
                publicFile: indexHtmlPath
            }))],

            assetOutterDir && [startsWith(assetPrefix), runTimeError(publicDir({
                publicDir: assetOutterDir
            }))],

            pfcApiPath && [pfcApiPath, pfcApiMid(pfcContexter, pfcVariableStub)],

            rest && [truth, rest]
        ])
    );
};
