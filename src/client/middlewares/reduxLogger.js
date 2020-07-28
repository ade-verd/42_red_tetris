'use strict';

import { createLogger } from 'redux-logger';
// https://github.com/LogRocket/redux-logger#readme

const titleFormatter = (action, time, took) => {
    const actionName = typeof action.action === 'string' && action.action.toUpperCase();
    const type = action.type || action.event;

    return `action @ ${time} [${actionName}] ${type}`;
    // return `action @ ${time} [${actionName}] ${type} (in ${took.toFixed(2)} ms)`;
};

const options = {
    diff: true,
    titleFormatter,
};

export default createLogger(options);
