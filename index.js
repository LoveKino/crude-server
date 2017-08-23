'use strict';

let http = require('http');

let url = require('url');

/**
 * TODO some default mids
 */
module.exports = (apier) => {
    let server = null;
    let sockets = [],
        nextSocketId = 0;

    let start = (port = 0) => {
        if (server) return;
        server = http.createServer((req, res) => {
            let urlObject = url.parse(req.url, true);
            // filter api
            let api = apier(urlObject.pathname, req.url, req);
            if (api) {
                return api(req, res, urlObject);
            } else {
                res.end('unsupported api');
            }
        });

        server.on('connection', (socket) => {
            let id = nextSocketId++;
            sockets[id] = socket;

            socket.on('close', () => {
                delete sockets[id];
            });
        });

        return new Promise((resolve, reject) => {
            server.listen(port, (err) => {
                if (err) reject(err);
                else {
                    resolve({
                        address: server.address(),
                        port,
                        server
                    });
                }
            });
        });
    };

    let stop = () => {
        if (!server) return;
        return new Promise((resolve, reject) => {
            sockets.forEach((socket) => {
                socket && socket.destroy();
            });

            server.close((err) => {
                if (err) {
                    server = null;
                    reject(err);
                } else {
                    server = null;
                    resolve();
                }
            });
        });
    };

    return {
        start,
        stop
    };
};
