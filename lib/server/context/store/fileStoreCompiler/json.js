'use strict';

let {
    parseStrToAst,
    executeAST,
    checkAST
} = require('tree-script');

let JsonTree = require('tree-script/lib/jsonTree');

// define query and update scripts

module.exports = (custom = {}) => Object.assign({
    defaultFileContentObj: {},
    serialize: JSON.stringify,
    deserialize: JSON.parse,

    queryCompiler: (queryScript, {
        variableStub
    } = {}) => {
        let ast = parseStrToAst(queryScript);
        if (variableStub) {
            checkAST(ast, {
                variableStub
            });
        }

        return (fileCntObject, extra) => {
            let options = JsonTree(fileCntObject);
            options.variableMap = extra;
            options.variableStub = variableStub;

            return executeAST(ast, options);
        };
    },

    updateCompiler: (updateScript, {
        variableStub
    } = {}) => {
        let ast = parseStrToAst(updateScript);
        if (variableStub) {
            checkAST(ast, {
                variableStub
            });
        }

        return (fileCntObject, extra = {}) => {
            let options = JsonTree(fileCntObject);
            options.variableMap = extra;
            options.variableStub = variableStub;

            executeAST(ast, options);
            return fileCntObject;
        };
    }
}, custom);
