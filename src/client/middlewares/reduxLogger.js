'use strict';

import { createLogger } from 'redux-logger';
// https://github.com/LogRocket/redux-logger#readme

const titleFormatter = (action, time, took) => {
    const actionName = typeof action.action === 'string' && action.action.toUpperCase();
    const type = action.type || action.event || action.action;

    return `action @ ${time} [${actionName}] ${type}`;
};

const options = {
    diff: true,
    titleFormatter,
};

export default createLogger(options);
