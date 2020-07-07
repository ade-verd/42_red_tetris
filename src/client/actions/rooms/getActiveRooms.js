import { ACTIONS } from '../../middlewares/handleSocket';
import { updateStatePlayersNames } from '../players/getPlayer';

export const emitGetActiveRooms = dispatch =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'rooms:get_active',
    });

export const onGotActiveRooms = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'rooms:players:got',
        fn: payload => {
            updateStatePlayersNames(dispatch, payload);
        },
    });
};
