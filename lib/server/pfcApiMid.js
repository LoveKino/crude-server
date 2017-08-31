'use strict';

let {
    executeAST,
    checkASTWithContext,
    parser
} = require('pfc-compiler');

/**
 * using pfc grammer as a basic communication way
 */

module.exports = (contexter) => {
    return (req, res) => {
        let context = contexter(req, res);
        let handleChunk = parser();

        return bodyChunk(req, (chunk) => {
            if (chunk) {
                handleChunk(chunk.toString());
            }
        }).then(() => {
            let ast = handleChunk(null);
            checkASTWithContext(ast, context);
            return executeAST(ast, context);
        }).then((result) => {
            res.end(JSON.stringify({
                errno: 0,
                bridge: 'pfc',
                data: result
            }));
        }).catch((err) => {
            res.end(JSON.stringify({
                errno: -1,
                bridge: 'pfc',
                errMsg: err.toString()
            }));
        });
    };
};

let bodyChunk = (req, onChunk) => {
    return new Promise((resolve, reject) => {
        req.on('data', (chunk) => {
            onChunk && onChunk(chunk);
        });

        req.on('end', () => {
            resolve();
        });

        req.on('error', () => {
            reject();
        });
    });
};
