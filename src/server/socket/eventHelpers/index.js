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
function createEvent(onEventName, emitEventName, rules, fn) {
    hoek.assert(!!onEventName, '[helpers] createEvent() must have an event name to listen on');
    hoek.assert(!!emitEventName, '[helpers] createEvent() must have an event name to emit on');
    hoek.assert(typeof fn === 'function', '[helpers] createEvent() must have a function');

    return {
        onEventName,
        emitEventName,
        fn,
        validation: rules && Joi.object().keys(rules),
    };
}

/**
 * Bind an event to a socket
 * @param {String} onEventName - The name of the event to listen
 * @param {String} emitEventName - The name of the event to emit
 * @param {Object} validation - A Joi object validation
 * @param {Function} fn - The function to be called on event
 */
function bindEvent(socket, { onEventName, emitEventName, validation, fn }) {
    socket.on(onEventName, (payload = {}) => {
        console.log('[socket event received]', onEventName, JSON.stringify(payload));

        if (validation) {
            const { error } = validation.validate(payload);
            if (error) {
                console.error(emitEventName, error);
                socket.emit(emitEventName, { error: error.toString() });
                return error;
            }
        }
        return fn(socket, payload);
    });
}

module.exports = {
    createEvent,
    bindEvent,
};
