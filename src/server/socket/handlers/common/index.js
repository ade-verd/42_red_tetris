/* istanbul ignore file */
module.exports = {
    ...require('./createPlayerAndRoom'),
    ...require('./disconnecting'),
    ...require('./latency'),
};
