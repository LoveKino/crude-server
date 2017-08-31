'use strict';

let fs = require('fs');
let promisify = require('es6-promisify');
let path = require('path');
let Cache = require('./cache');
let mkdirp = promisify(require('mkdirp'));

let readFile = promisify(fs.readFile);
let writeFile = promisify(fs.writeFile);
let stat = promisify(fs.stat);

let isWindow = () => process.platform === 'win32';
let getUserHome = () => {
    return process.env[isWindow() ? 'USERPROFILE' : 'HOME'];
};

let USER_HOME = getUserHome();

const identity = v => v;
const noop = () => Promise.resolve();

let existsFile = (filePath) => {
    return new Promise((resolve) => {
        stat(filePath).then((statObj) => {
            resolve(statObj.isFile());
        }).catch(() => {
            resolve(false);
        });
    });
};

module.exports = ({
    safeDir = USER_HOME,
    cacheInMemory = false,
    maxCacheSize = 100 * 1024 * 1024,
    expireTime = 2 * 3600 * 1000,
    completeDir = false,
    compiler: {
        defaultFileContentObj = '',
        serialize = identity,
        deserialize = identity,
        queryCompiler = (() => (fileCntObject) => fileCntObject),
        updateCompiler = (() => (fileCntObject, extra) => extra)
    } = {}
} = {}) => {
    if (typeof safeDir !== 'string') {
        throw new TypeError(`safeDir need to be string, but got ${safeDir}.`);
    }

    if (!path.isAbsolute(safeDir)) {
        throw new Error(`safeDir must be absolute path, but got ${safeDir}.`);
    }
    safeDir = path.resolve(safeDir);

    let cache = null;

    if (cacheInMemory) {
        cache = Cache({
            maxCacheSize,
            expireTime
        });
    }

    let getFileCnt = (filePath) => {
        let cachedObj = cache && cache.getCache(filePath);
        if (cachedObj) {
            return Promise.resolve(cachedObj.value);
        }

        return (completeDir ? mkdirp(path.dirname(filePath)) : noop()).then(() => {
            return existsFile(filePath).then((exists) => {
                if (!exists) {
                    return writeFile(filePath, serialize(defaultFileContentObj), 'utf-8');
                }
            }).then(() => {
                return readFile(filePath, 'utf-8').then((fileStr) => {
                    let fileCntObject = deserialize(fileStr);
                    cache && cache.setCache(filePath, fileCntObject, fileStr.length);
                    return fileCntObject;
                });
            });
        });
    };

    let query = (...args) => {
        let filterFn = queryCompiler(...args);
        return (filePath, extra) => {
            // check filePath
            checkFilePath(filePath, safeDir);
            return getFileCnt(filePath).then((fileCntObject) => filterFn(fileCntObject, extra));
        };
    };

    let update = (...args) => {
        let updateFn = updateCompiler(...args);
        return (filePath, extra) => {
            checkFilePath(filePath, safeDir);

            return getFileCnt(filePath).then((fileCntObject) => {
                fileCntObject = updateFn(fileCntObject, extra);
                let fileStr = serialize(fileCntObject);
                // update cache
                cache && cache.setCache(filePath, fileCntObject, fileStr.length);
                return fileStr;
            }).then((fileStr) => {
                // update file
                return writeFile(filePath, fileStr, 'utf-8');
            });
        };
    };

    return {
        query,
        update
    };
};

let checkFilePath = (filePath, safeDir) => {
    if (typeof filePath !== 'string') {
        throw new TypeError(`filePath need to be string, but got ${filePath}.`);
    }

    if (!path.isAbsolute(filePath)) {
        throw new Error(`filePath need to be absolute path, but got ${filePath}.`);
    }

    if (!filePath.startsWith(safeDir)) {
        throw new Error(`filePath is out of safe dir, filePath is ${filePath}, safeDir is ${safeDir}`);
    }
};
