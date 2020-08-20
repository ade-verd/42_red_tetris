const fs = require('fs');

const ERRORS = {
    E404: '404: File not found',
    E500: '500: Internal server error',
};

const checkFileExist = path => {
    return new Promise((resolve, reject) => {
        fs.access(path, fs.F_OK, err => {
            if (err) {
                reject(new Error(ERRORS.E404));
            }
            resolve();
        });
    });
};

const readFile = path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(new Error(ERRORS.E500));
            }
            resolve(data);
        });
    });
};

module.exports = { checkFileExist, readFile, ERRORS };
