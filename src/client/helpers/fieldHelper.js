import { store } from '../index';

export const FIELD_WIDTH = 10;
export const FIELD_HEIGHT = 20;

export const createField = () =>
    Array.from(Array(FIELD_HEIGHT), () => new Array(FIELD_WIDTH).fill([0, 'clear']));

export const updateField = (prevField, pliece) => {
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
        store.dispatch({ type: 'reset' });
        return sweepRows(newStage);
    }
    return newField;
};
