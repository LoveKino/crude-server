'use strict';

let responseFile = require('../responseFile');

module.exports = ({
    publicFile
} = {}) => {
    // TODO check
    return (req, res) => {
        return responseFile(publicFile, res);
    };
};
