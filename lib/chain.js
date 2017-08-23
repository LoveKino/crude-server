'use strict';

/**
 *
 * matchList = [
 *  [],
 *  []
 * ];
 */
module.exports = (matchList) => {
    // TODO check
    return (pathname, reqUrl, req) => {
        for (let i = 0; i < matchList.length; i++) {
            let [match, item] = matchList[i];

            // TODO match DSL for req
            if (typeof match === 'string' && pathname === match) {
                return item;
            } else if (typeof match === 'function' && match(pathname, reqUrl, req)) {
                return item;
            }
        }
    };
};
