import { ACTIONS } from '../../middlewares/handleSocket';

import { store } from '../../store/store';

const getScorePayload = (id, name, score) => {
    return {
        player_id: id,
        player_name: name,
        score,
    };
};

export const emitScore = dispatch => {
    const {
        usr: { id, name },
        gme: { score },
    } = store.getState();

    dispatch({
        action: ACTIONS.EMIT,
        event: 'score:send',
        data: getScorePayload(id, name, score),
    });
};

export const emitGetHighscores = dispatch => {
    dispatch({
        action: ACTIONS.EMIT,
        event: 'highscores:request',
    });
};

export const updateHighscoresState = (dispatch, payload) => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'UPDATE_HIGHSCORES',
        highscores: payload.highscores,
    });
};

export const onHighscores = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'highscores:requested',
        fn: payload => {
            updateHighscoresState(dispatch, payload);
        },
    });
};
