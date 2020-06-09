import { ACTIONS } from '../../middleware/handleSocket';
import { checkCollision } from '../../helpers/checkCollision'

export const movePiece = (dispatch, event, gameStatus) => {
    dispatch({ action: ACTIONS.REDUCE, type: 'MOVE', dispatch, event, gameStatus });
};

export const onKeyUp = (dispatch, keyUp) => {
    dispatch({ action: ACTIONS.REDUCE, type: 'KEY_UP', dispatch, keyUp });
};


const dropAction = (dispatch, field, piece, { rows, level }) => {
   return  () => {
        // Increase level when player has cleared 10 rows
        if (rows > (level + 1) * 10) {
            dispatch({ type: 'INCREMENT_LEVEL' });
            // Also increase speed
            dispatch({ type: 'SET_DROPTIME', dropTime: 1000 / (level + 1) + 200});
        }
        
        if (!checkCollision(piece, field, { x: 0, y: 1 })) {
            console.log('dropping')
            dispatch({ type: 'SET_POS', pos: { x: 0, y: 1 }, collided: false });
            console.log('dropped')
        } else {
            // Game over !
            if (piece.pos.y < 1) {
                console.debug('GAME OVER !');
                dispatch({ type: 'SET_GAMEOVER', gameOver: true });
                dispatch({ type: 'SET_DROPTIME', dropTime: null });
            }
            dispatch({ type: 'SET_POS', pos: { x: 0, y: 0 }, collided: true });
        }
    };
};

export const drop = (dispatch, field, piece, gameStatus) => {
    dispatch(dropAction(dispatch, field, piece, gameStatus));
};


