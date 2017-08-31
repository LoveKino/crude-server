'use strict';

let responseFile = require('../responseFile');
let path = require('path');

module.exports = ({
    publicDir
} = {}) => {
    return (req, res, {
        pathname
    }) => {
        let filePath = path.join(publicDir, '.' + pathname);
        return responseFile(filePath, res);
    };
};
