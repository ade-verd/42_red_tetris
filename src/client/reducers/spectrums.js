import notify from '../actions/notifications';

const handleError = (state, error, errorFieldName) => {
    console.error(`[spectrum reducer][${errorFieldName}]`, error);
    return {
        ...state,
        [errorFieldName]: error,
    };
};

const setSpectrum = (state, playerId, playerName, spectrum, error) => {
    if (error !== undefined) {
        if (error.startsWith('ValidationError')) {
            notify({ type: 'warning', msg: 'Spectrum payload one field is missing' });
        } else {
            notify({ type: 'error', msg: 'Error while creating the spectrum' });
        }
        return handleError(state, action.error, 'creationError');
    }

    return {
        ...state,
        [playerId]: { playerName, spectrum },
    };
};

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'RESET':
            return {};
        case 'SET_SPECTRUM':
            return setSpectrum(
                state,
                action.playerId,
                action.playerName,
                action.spectrum,
                action.error,
            );
        default:
            return state;
    }
};

export default reducer;
