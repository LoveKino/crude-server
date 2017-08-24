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
            let matchItem = matchList[i];
            if (matchItem) {
                let [match, item] = matchItem;

                // TODO match DSL for req
                if (typeof match === 'string' && pathname === match) {
                    return item;
                } else if (typeof match === 'function' && match(pathname, reqUrl, req)) {
                    return item;
                }
            }
        }
    };
};
