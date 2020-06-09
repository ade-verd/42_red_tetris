import { FIELD_WIDTH } from '../../constants';
import { checkCollision } from '../helpers/checkCollision'

const firstRender = () => {
    return {
        pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
        collided: false,
        tetromino: null,
        dropTime: 1000,
    };
};

const setPos = (state, { x, y }, collided ) => {
    console.log('[setPos] state =', state)
    return {
        ...state,
        pos: { x: state.pos.x + x, y: state.pos.y + y },
        collided
    }
}

const setTetromino = (state, tetromino) => {
    return {
        ...state,
        tetromino,
    };
};

const setDropTime = (state, dropTime) => {
    return {
        ...state,
        dropTime,
    }
}

// const drop = (state, dispatch, field, piece, { rows, level }) => {
//     // Increase level when player has cleared 10 rows
//     if (rows > (level + 1) * 10) {
//         // setLevel(prev => prev + 1);
//         dispatch({ type: 'INCREMENT_LEVEL' });
//         // Also increase speed
//         // setDropTime(1000 / (level + 1) + 200);
//         dispatch({ type: 'SET_DROPTIME', dropTime: 1000 / (level + 1) + 200});
//     }
    
//     if (!checkCollision(piece, field, { x: 0, y: 1 })) {
//         console.log('dropping')
//         dispatch({ type: 'SET_POS', pos: { x: 0, y: 1 }, collided: false });
//         console.log('dropped')
//     } else {
//         // Game over !
//         if (piece.pos.y < 1) {
//             console.debug('GAME OVER !');
//             // setGameOver(true);
//             dispatch({ type: 'SET_GAMEOVER', gameOver: true });
//             // setDropTime(null);
//             dispatch({ type: 'SET_DROPTIME', dropTime: null });
//         }
//         // updatePlayerPos({ x: 0, y: 0, collided: true });
//         dispatch({ type: 'SET_POS', pos: { x: 0, y: 0 }, collided: true });
//     }
//     return state;
// };

const move = (state, dispatch, { keyCode }, { gameOver }) => {
    if (!gameOver) {
        return state
    }
    return state;
};

const keyUp = (dispatch, { keyCode }, { gameOver, level }) => {
    if (!gameOver) {
        // Activate the interval again when user releases down arrow.
        if (keyCode === 40) {
            dispatch({ type: 'SET_DROPTIME', dropTime: 1000 / (level + 1) });
        }
    }
}


const reducer = (state = {}, action) => {
    console.log('ACTION', action);
    switch (action.type) {
        case 'FIRST_RENDER':
            return firstRender();
        case 'SET_POS':
            console.log('action setPos');
            return setPos(state, action.pos, action.collided);
        case 'SET_TETROMINO':
            return setTetromino(state, action.piece);
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
        case 'reset':
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
