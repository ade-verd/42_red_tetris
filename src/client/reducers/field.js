import { FIELD_HEIGHT, FIELD_WIDTH } from '../../constants';
import { ACTIONS } from '../middleware/handleSocket';

export const createField = () => {
    const newField = Array.from(Array(FIELD_HEIGHT), () => new Array(FIELD_WIDTH).fill([0, 'clear']));
    return {
        field: newField,
    };
}

const sweepRows = (asyncDispatch, newField) => {
    const isClear = cell => cell[0] === 0;
    const reducer = (ack, row) => {
        if (row.findIndex(isClear) === -1) {
            asyncDispatch({ action: ACTIONS.REDUCE, type: 'INCREMENT_ROWSCLEARED' });
            ack.unshift(new Array(newField[0].length).fill([0, 'clear']));
            return ack;
        }
        ack.push(row);
        return ack;
    }
    return newField.reduce(reducer, []);
}

export const updateField = (asyncDispatch, prevField, piece, allStates) => {
    // First flush the stage
    const newField = prevField.map(row =>
        row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)),
    );
    // Then draw the tetromino
    piece.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                newField[y + piece.pos.y][x + piece.pos.x] = [
                    value,
                    `${piece.collided ? 'merged' : 'clear'}`,
                ];
            }
        });
    });
    // Then check if we collided
    if (piece.collided) {
        asyncDispatch({ action: ACTIONS.REDUCE, type: 'SET_TETROMINO' });
        return {
            field: sweepRows(asyncDispatch, newField),
        }
    }
    return {
        field: newField,
    };
};


const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'FIRST_RENDER':
            return createField();
        case 'UPDATE':
            console.log('updating')
            return updateField(action.asyncDispatch, state.field, action.piece, action.allStates);
        default:
            return state;
    }
};

export default reducer;
