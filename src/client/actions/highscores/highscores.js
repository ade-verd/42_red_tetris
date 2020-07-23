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
        gme: { score }
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

export const onHighscores = (dispatch, setHighscores) => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'highscores:requested',
        fn: payload => {
            setHighscores(payload.highscores);
        },
    });
};
