'use strict';

const hoek = require('@hapi/hoek');
const Joi = require('@hapi/joi');

/**
 * Create an event to be implemented into sockets
 * @param {String} name - The name of the event
 * @param {Object} rules - Object containing Joi validation rules
 * @param {Function} fn - The function to be called on event
 * @returns {Object} The event Object
 */
function createEvent(name, rules, fn) {
	hoek.assert(!!name, '[helpers] createEvent() must have a name');
	hoek.assert(typeof fn === 'function', '[helpers] createEvent() must have a function');

	return {
		name,
		fn,
		validation: rules && Joi.object().keys(rules)
	};
};

/**
 * Bind an event to a socket
 * @param {String} name - The name of the event
 * @param {Object} validation - A Joi object validation
 * @param {Function} fn - The function to be called on event
 */
function bindEvent(socket, { name, validation, fn }) {
	socket.on(name, (payload = {}) => {
		console.log('[socket event received]', name, payload);

		if (validation) {
			const { error } = validation.validate(payload);
			if (error) {
				return socket.emit(name, { error });
			}
		}
		return fn(socket, payload);
	});
};

module.exports = {
	createEvent,
	bindEvent,
}