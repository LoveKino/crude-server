'use srtict';

let startsWith = (prefix) => (pathname) => {
    return pathname.startsWith(prefix);
};

module.exports = {
    startsWith
};
