'use strict';

let defLog = console.log; // eslint-disable-line

module.exports = ({
    log = defLog
} = {}) => {
    let responseSuccess = (result, res) => {
        res.end(JSON.stringify({
            errno: 0,
            data: result
        }));
    };

    let runTimeError = (fn) => {
        return async(req, res) => {
            try {
                await fn(req, res);
            } catch (err) {
                res.end(JSON.stringify({
                    errno: 1,
                    errMsg: `Error happened. Error message: ${err.toString()}`
                }));
                log(err);
            }
        };
    };

    return {
        responseSuccess,
        runTimeError
    };
};
