'use strict';

let http = require('http');

let url = require('url');

let {
    forEach
} = require('bolzano');

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
            let {
                pathname
            } = url.parse(req.url);
            // filter api
            let api = apier(pathname, req.url, req);
            if (api) {
                return api(req, res);
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
            forEach(sockets, (socket) => {
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
