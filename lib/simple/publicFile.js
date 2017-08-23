'use strict';

let responseFile = require('../responseFile');

module.exports = ({
    publicFile
} = {}) => {
    return (req, res) => {
        return responseFile(publicFile, res);
    };
};
