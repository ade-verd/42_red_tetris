import { FIELD_WIDTH } from '../../constants';
import { ACTIONS } from '../middlewares/handleSocket';
import { emitGetRandomTetriminos } from '../actions/game/getTetriminos';
import { checkCollision } from '../helpers/checkCollision';

const resetGame = (state, isAdmin) => {
    // Admin provides all the tetromino datas, so we keep it for him
    if (isAdmin) {
        return {
            ...state,
            pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
            collided: false,
            dropTime: null,
            amount: 20,
            projection: null,
        };
    } else {
        return {
            pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
            collided: false,
            tetromino: null,
            nextTetromino: null,
            dropTime: null,
            pieces: null,
            index: 0,
            amount: 20,
            projection: null,
        };
    }
};

const setPieces = (state, pieces) => {
    return {
        ...state,
        pieces: pieces,
    };
};

const setIndex = (state, index) => {
    return {
        ...state,
        index: index,
    };
};

const setPos = (state, asyncDispatch, { x, y }, collided) => {
    if (x !== 0 || y < 0) {
        asyncDispatch({ action: ACTIONS.REDUCE, type: 'UPDATE_PROJECTION' });
    }

    const X = state.pos.x + x;
    // If the malus pushs the piece out of limit :
    const Y = state.pos.y + y < 0 ? 0 : state.pos.y + y;

    return {
        ...state,
        pos: { x: X, y: Y },
        collided,
    };
};

const setDropTime = (state, dropTime) => {
    return {
        ...state,
        dropTime,
    };
};

const setTetromino = (state, asyncDispatch, tetromino, pos) => {
    asyncDispatch({ action: ACTIONS.REDUCE, type: 'UPDATE_PROJECTION' });

    return {
        ...state,
        tetromino,
        pos,
    };
};

const getTetromino = (state, asyncDispatch, roomId, { gameWon, gameOver }) => {
    if (gameWon || gameOver) return state;

    asyncDispatch({ action: ACTIONS.REDUCE, type: 'UPDATE_PROJECTION' });
    // If we almost reached the end of pieces array (2 pieces left), we emit to ask new pieces
    if ((state.index % state.amount) + 2 === state.amount) {
        // we add 1 to ask the next "pieces" array
        emitGetRandomTetriminos(asyncDispatch, roomId, state.index + 2 + 1, state.amount);
    }

    if (!state.nextTetromino) {
        return {
            ...state,
            tetromino: state.pieces[0].shape,
            nextTetromino: state.pieces[1].shape,
            index: state.index + 1,
        };
    } else {
        return {
            ...state,
            tetromino: state.nextTetromino,
            nextTetromino: state.pieces[(state.index + 1) % state.amount].shape,
            pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
            collided: false,
            index: state.index + 1,
        };
    }
};

const setNextTetromino = (state, nextTetromino) => {
    return {
        ...state,
        nextTetromino,
    };
};

const updateProjection = (state, field) => {
    const tetromino = JSON.parse(JSON.stringify(state.tetromino));

    let pos = 0;
    while (!checkCollision(state, field, { x: 0, y: pos })) {
        pos += 1;
    }
    const newPos = { x: state.pos.x, y: state.pos.y + pos - 1 };

    return {
        ...state,
        projection: { tetromino, pos: newPos },
    };
};

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'RESET':
            return resetGame(state, action.isAdmin);
        case 'SET_PIECES':
            return setPieces(state, action.pieces);
        case 'SET_INDEX':
            return setIndex(state, action.index);
        case 'SET_POS':
            return setPos(state, action.asyncDispatch, action.pos, action.collided);
        case 'SET_DROPTIME':
            return setDropTime(state, action.dropTime);
        case 'SET_TETROMINO':
            return setTetromino(state, action.asyncDispatch, action.tetromino, action.pos);
        case 'GET_TETROMINO':
            return getTetromino(
                state,
                action.asyncDispatch,
                action.allStates.usr.roomId,
                action.allStates.gme,
            );
        case 'SET_NEXT_TETROMINO':
            return setNextTetromino(state, action.nextTetromino);
        case 'UPDATE_PROJECTION':
            return updateProjection(state, action.allStates.fld.field);
        default:
            return state;
    }
};

export default reducer;
