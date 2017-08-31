'use strict';

let requestor = (apiPath = '/api/pfc') => (pfcCode) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let {
                        errno,
                        errMsg,
                        data
                    } = JSON.parse(xhr.responseText);
                    if (errno === 0) {
                        resolve(data);
                    } else {
                        reject(new Error((errMsg.split(':')[1] || '').trim()));
                    }
                } else {
                    reject(new Error(`status code is ${xhr.status}`));
                }
            }
        };

        xhr.open('post', apiPath);
        xhr.send(pfcCode);
    });
};

module.exports = requestor;
