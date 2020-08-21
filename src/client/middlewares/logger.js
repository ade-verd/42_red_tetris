'use strict';

import config from '../config';

const LEVELS = ['trace', 'debug', 'info', 'log', 'warn', 'error', 'fatal'];

const console = (function(oldConsole) {
    const shouldLog = currentLevel => {
        return LEVELS.indexOf(currentLevel) >= LEVELS.indexOf(config.logger.level);
    };

    return {
        ...oldConsole,
        trace: function(text) {
            if (shouldLog('trace')) oldConsole.trace.apply(oldConsole, arguments);
        },
        debug: function(text) {
            if (shouldLog('debug')) oldConsole.debug.apply(oldConsole, arguments);
        },
        info: function(text) {
            if (shouldLog('info')) oldConsole.info.apply(oldConsole, arguments);
        },
        log: function(text) {
            if (shouldLog('info')) oldConsole.log.apply(oldConsole, arguments);
        },
        warn: function(text) {
            if (shouldLog('warn')) oldConsole.warn.apply(oldConsole, arguments);
        },
        error: function(text) {
            oldConsole.error.apply(oldConsole, arguments);
        },
    };
})(window.console);

window.console = console;

window.console.warn('LOG_LEVEL defined as', config.logger.level);
