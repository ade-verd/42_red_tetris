import { FIELD_HEIGHT, FIELD_WIDTH } from '../../constants';

export const createField = () => {
    const newField = Array.from(Array(FIELD_HEIGHT), () => new Array(FIELD_WIDTH).fill([0, 'clear']));
    return {
        field: newField,
    };
}

export const updateField = (dispatch, prevField, piece) => {
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
        dispatch({ type: 'reset' });
        return sweepRows(newStage);
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
            return updateField(action.dispatch, state.field, action.piece);
        default:
            return state;
    }
};

export default reducer;
