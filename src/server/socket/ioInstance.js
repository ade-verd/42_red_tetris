'use strict';

let io;

const get = () => io;

const set = instance => {
    io = instance;
};

module.exports = { get, set };
