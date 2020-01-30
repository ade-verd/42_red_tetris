'use strict';

function newDate(str) {
	return new Date(str || Date.now());
}

module.exports = {
	newDate,
}