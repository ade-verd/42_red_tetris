'use strict';

function newDate(str = null) {
    return str !== null ? new Date(str) : new Date();
}

module.exports = {
    newDate,
};
