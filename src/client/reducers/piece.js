import { FIELD_WIDTH } from '../../constants';
import { ACTIONS } from '../middleware/handleSocket';
import { emitGetRandomTetriminos } from '../actions/game/getTetriminos';

const firstRender = () => {
    return {
        pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
        collided: false,
        tetromino: null,
        nextTetromino: null,
        dropTime: null,
        pieces: [],
        index: 0,
        amount: 20,
    };
};

const setPieces = (state, pieces) => {
    return {
        ...state,
        pieces: pieces,
    }
}

const setPos = (state, { x, y }, collided ) => {
    console.log('[setPos] state =', state)
    return {
        ...state,
        pos: { x: state.pos.x + x, y: state.pos.y + y },
        collided
    }
}

const setTetromino = (state, asyncDispatch, roomId) => {
    // If "nextTetromino" reached the end of pieces array we ask for new pieces
    // which means, at this point, index + 2 === undefined.
    if (!state.pieces[state.index % state.amount + 2]) {
        // we add 1 to ask the next "pieces" array
        emitGetRandomTetriminos(asyncDispatch, roomId, (state.index + 2) + 1, state.amount);
    }

    console.log('ENTER')

    if (!state.nextTetromino) {
        console.log('TOTO')
        return {
            ...state,
            tetromino: state.pieces[0].shape,
            nextTetromino: state.pieces[1].shape,
            index: state.index + 1,
        };
    } else {
        console.log('SEMRA')
        return {
            ...state,
            tetromino: state.nextTetromino,
            nextTetromino: state.pieces[state.index + 1 % state.amount].shape,
            pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
            collided: false,
            index: state.index + 1,
        };
    }
};

const setDropTime = (state, dropTime) => {
    return {
        ...state,
        dropTime,
    }
}

const move = (state, dispatch, { keyCode }, { gameOver }) => {
    if (!gameOver) {
        return state
    }
    return state;
};

const keyUp = (asyncDispatch, { keyCode }, { gameOver, level }) => {
    if (!gameOver) {
        // Activate the interval again when user releases down arrow.
        if (keyCode === 40) {
            asyncDispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 / (level + 1) });
        }
    }
}


const reducer = (state = {}, action) => {
    console.log('ACTION', action);
    console.log('Aydin', action.allStates, action.asyncDispatch)
    switch (action.type) {
        case 'FIRST_RENDER':
            return firstRender();
        case 'SET_PIECES':
            return setPieces(state, action.pieces);
        case 'SET_POS':
            console.log('action setPos');
            return setPos(state, action.pos, action.collided);
        case 'SET_TETROMINO':
            return setTetromino(state, action.asyncDispatch, action.allStates.usr.roomId);
        case 'SET_DROPTIME':
            return setDropTime(state, action.dropTime);
        // case 'DROP':
        //     return drop(state, action.dispatch, action.field, action.piece, action.gameStatus);
        case 'MOVE':
            return move(state, action.dispatch, action.key, action.gameStatus);
        case 'KEY_UP':
            return keyUp(state, action.dispatch, action.key, action.gameStatus);
        case 'rotate':
            return {
                ...state,
                // piece: updateField()
            };
        case 'RESET_PIECE':
            return {
                pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
                tetromino: action.piece,
                collided: false,
            };
        default:
            return state;
    }
};

export default reducer;
