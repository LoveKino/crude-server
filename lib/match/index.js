'use srtict';

let startsWith = (prefix) => (pathname) => {
    return pathname.startsWith(prefix);
};

let truth = () => true;

module.exports = {
    startsWith,
    truth
};
