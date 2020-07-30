'use strict';

import notify from '../actions/notifications';

const handleError = (state, error, errorFieldName) => {
    console.error(`[highscores reducer][${errorFieldName}]`, error);
    return {
        ...state,
    };
};

const handleHighsccoresUpdate = (state, action) => {
    if (action.error !== undefined) {
        notify({ type: 'error', msg: 'An error occurred while updating highscores' });
        return handleError(state, action.error, 'highscores update');
    }

    return {
        ...state,
        highscores: action.highscores,
    };
};

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_HIGHSCORES':
            return handleHighsccoresUpdate(state, action);
        default:
            return state;
    }
};

export default reducer;
