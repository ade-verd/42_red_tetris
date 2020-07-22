import { ACTIONS } from '../middlewares/handleSocket';
import { emitMalus } from '../actions/game/malus';
import { emitGameOver } from '../actions/game/status';
import { setRowsCleared } from '../reducers/field';

const updateRowsScore = (state, asyncDispatch, roomId) => {
    if (state.rowsCleared === 0) return state;
    if (state.rowsCleared > 1) emitMalus(asyncDispatch, roomId, state.rowsCleared - 1);

    const linePoints = [40, 100, 300, 1200];

    // Reset asynchronously rowsCleared after game status updated
    setRowsCleared(asyncDispatch, { rowsCleared: 0 });

    return {
        ...state,
        score: state.score + linePoints[state.rowsCleared - 1] * (state.level + 1),
        rows: state.rows + state.rowsCleared,
    };
};

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'RESET':
            return {
                score: 0,
                rows: 0,
                rowsCleared: 0,
                level: 1,
                gameOver: false,
                gameWon: false,
            };
        case 'UPDATE_ROWS_SCORE':
            return updateRowsScore(state, action.asyncDispatch, action.allStates.usr.roomId);
        case 'INCREMENT_LEVEL':
            return {
                ...state,
                level: state.level + 1,
            };
        case 'SET_ROWSCLEARED':
            return {
                ...state,
                rowsCleared: action.rowsCleared,
            };
        case 'INCREMENT_ROWSCLEARED':
            return {
                ...state,
                rowsCleared: state.rowsCleared + 1,
            };
        case 'GAMEOVER':
            emitGameOver(action.asyncDispatch);
            return {
                ...state,
                gameOver: true,
            };
        case 'GAMEWON':
            return {
                ...state,
                gameWon: true,
            };
        default:
            return state;
    }
};

export default reducer;
