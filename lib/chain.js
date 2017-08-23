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
    return (req, res, obj) => {
        let {
            pathname
        } = obj;

        for (let i = 0; i < matchList.length; i++) {
            let [match, item] = matchList[i];

            // TODO match DSL for req
            if (typeof match === 'string' && pathname === match) {
                return item;
            } else if (typeof match === 'function' && match(req, res, obj)) {
                return item;
            }
        }
    };
};
