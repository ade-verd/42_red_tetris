'use strict';

export const newDate = (str = null) => {
    return str !== null ? new Date(str) : new Date();
};

const timeWithLeadingZero = time => (time < 10 ? '0' : '') + time;

export const timestampToDatetime = timestamp => {
    const date = new Date(timestamp);
    return {
        date,
        h: timeWithLeadingZero(date.getHours()),
        m: timeWithLeadingZero(date.getMinutes()),
        s: timeWithLeadingZero(date.getSeconds()),
    };
};
