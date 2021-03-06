import { FIELD_HEIGHT, FIELD_WIDTH } from '../../constants';
import { ACTIONS } from '../middlewares/handleSocket';
import { checkCollision } from '../helpers/checkCollision';
import { emitSpectrum } from '../actions/game/spectrum';

export const incrementRowsCleared = asyncDispatch => {
    asyncDispatch({ action: ACTIONS.REDUCE, type: 'INCREMENT_ROWSCLEARED' });
};

export const setRowsCleared = (asyncDispatch, { rowsCleared }) => {
    asyncDispatch({
        action: ACTIONS.REDUCE,
        type: 'SET_ROWSCLEARED',
        rowsCleared,
    });
};

export const createField = () => {
    const newField = Array.from(Array(FIELD_HEIGHT), () =>
        new Array(FIELD_WIDTH).fill([0, 'clear', false]),
    );
    return {
        field: newField,
    };
};

const sweepRows = (asyncDispatch, newField, { roomId, id, name }) => {
    const isClearOrMalus = cell => cell[0] === 0 || cell[0] === 'M';
    const reducer = (ack, row) => {
        if (row.findIndex(isClearOrMalus) === -1) {
            incrementRowsCleared(asyncDispatch);
            ack.unshift(new Array(newField[0].length).fill([0, 'clear', false]));
            return ack;
        }
        ack.push(row);
        return ack;
    };
    const sweptField = newField.reduce(reducer, []);

    emitSpectrum(asyncDispatch, roomId, id, name, sweptField);
    return sweptField;
};

export const updateField = (asyncDispatch, prevField, piece, user, malus = 0) => {
    if (piece.pos.y === 0 && checkCollision(piece, prevField, { x: 0, y: 0 })) {
        console.debug('[updateField] gameOver in top of field', prevField, piece);
        asyncDispatch({ action: ACTIONS.REDUCE, type: 'GAMEOVER' });
        asyncDispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: null });
        return {
            field: prevField,
        };
    }

    // 1. Flush the stage
    const newField = prevField.map(row =>
        row.map(cell => (cell[1] === 'clear' ? [0, 'clear', false] : cell)),
    );

    // 2. Draw malus row
    for (let i = 0; i < malus; i++) {
        newField.push(new Array(newField[0].length).fill(['M', 'malus', false]));
        newField.shift();
    }

    // 3. Draw the projection
    piece.projection.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                // If we draw malus row, we need to put projection's pos cell upper
                const Y =
                    y + piece.projection.pos.y - malus < 0 ? 0 : y + piece.projection.pos.y - malus;
                const X = x + piece.projection.pos.x;
                console.debug('[DrawProjection] newField', {
                    newField,
                    Y,
                    Ycalc: { y, yProjPos: piece.projection.pos.y, malus },
                });
                newField[Y][X] = [value, 'clear', true];
            }
        });
    });

    // 4. Draw the tetromino
    piece.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                // Same here if malus
                const Y = y + piece.pos.y - malus < 0 ? 0 : y + piece.pos.y - malus;
                const X = x + piece.pos.x;
                console.debug('[DrawTetrimino] newField', {
                    newField,
                    Y,
                    Ycalc: { y, ypos: piece.pos.y, malus },
                });
                newField[Y][X] = [value, `${piece.collided ? 'merged' : 'clear'}`, false];
            }
        });
    });

    // 5. Check if we collided
    if (piece.collided) {
        asyncDispatch({ action: ACTIONS.REDUCE, type: 'GET_TETROMINO' });
        return {
            field: sweepRows(asyncDispatch, newField, user),
        };
    }

    if (malus) emitSpectrum(asyncDispatch, user.roomId, user.id, user.name, newField);

    return {
        field: newField,
    };
};

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'RESET':
            return createField();
        case 'UPDATE':
            return updateField(
                action.asyncDispatch,
                state.field,
                action.allStates.pce,
                action.allStates.usr,
                action.malus,
            );
        default:
            return state;
    }
};

export default reducer;
