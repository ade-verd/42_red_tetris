'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../eventHelpers');

const schema = {
	type: Joi.string().required(),
}; 

const emitPong = (socket, payload) => {
	if (payload.type === 'server/ping') {
		socket.emit('action', { type: 'pong' });
	}
};

export const receivePing = helpers.createEvent(
	'action',
	schema,
	async (socket, payload) => {
		// Logic here
		emitPong(socket, payload);
	}
);