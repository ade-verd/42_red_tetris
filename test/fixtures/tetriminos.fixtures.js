'use strict';

const { TETRIMINOS } = require('../../src/constants/');

const tetriminos = () => ({ ...TETRIMINOS });

module.exports = {
	tetriminos,
}