import { emitSpectrum } from '../actions/game/spectrum';

import notify from '../actions/notifications';

const handleError = (state, error, errorFieldName) => {
    console.error(`[spectrum reducer][${errorFieldName}]`, error);
    return {
        ...state,
        [errorFieldName]: error,
    };
};

const setSpectrum = (state, playerId, spectrum, error) => {
    if (error !== undefined) {
        if (error.startsWith('ValidationError')) {
            notify({ type: 'warning', msg: 'Spectrum name is missing' });
        } else {
            notify({ type: 'error', msg: 'Error while creating the spectrum' });
        }
        return handleError(state, action.error, 'creationError');
    }

    return {
        ...state,
        [playerId]: spectrum,
    };
};

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_SPECTRUM':
            return setSpectrum(state, action.playerId, action.spectrum, action.error);
        case 'EMIT_SPECTRUM':
            emitSpectrum(
                action.asyncDispatch,
                action.roomId,
                action.playerId,
                action.allStates.fld.field,
            );
            return state;
        default:
            return state;
    }
};

export default reducer;
