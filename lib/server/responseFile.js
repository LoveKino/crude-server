'use strict';

let fs = require('fs');
let mime = require('./mime');
let path = require('path');

module.exports = (filePath, res) => {
    let contentType = mime[path.extname(filePath).substring('1')] || 'text/plain';
    res.setHeader('Content-Type', contentType);

    return new Promise((resolve, reject) => {
        let stream = fs.createReadStream(filePath);
        stream.on('data', (chunk) => {
            res.write(chunk);
        });

        stream.on('end', () => {
            res.end();
            resolve();
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
};
