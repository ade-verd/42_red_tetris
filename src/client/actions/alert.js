export const ALERT_POP = 'ALERT_POP';

export const alert = message => {
    return {
        action: 'reduce',
        type: ALERT_POP,
        message,
    };
};
