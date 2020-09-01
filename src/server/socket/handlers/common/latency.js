'use strict';

const helpers = require('../../eventHelpers');

const schema = null;

const ON_EVENT = 'client:ping';
const EMIT_EVENT = 'server:pong';

const ping = helpers.createEvent(ON_EVENT, EMIT_EVENT, schema, socket => {
    console.log('[ping]', { socketId: socket.client.id });
});

module.exports = { ping };
