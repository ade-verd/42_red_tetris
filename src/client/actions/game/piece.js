import { ACTIONS } from '../../middlewares/handleSocket';
import { checkCollision } from '../../helpers/checkCollision';

export const reactivateDropTime = (dispatch, { keyCode }, gameStatus) => {
    const { level, gameOver } = gameStatus;
    if (!gameOver) {
        // Activate the interval again when user releases down arrow
        if (keyCode === 40) {
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 / level });
        }
    }
};

export const drop = (dispatch, field, piece, gameStatus) => {
    const { rows, level } = gameStatus;
    // Increase level when player has cleared 10 rows
    if (rows > level * 10) {
        dispatch({ action: ACTIONS.REDUCE, type: 'INCREMENT_LEVEL' });
        // Also increase speed
        dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 / (level + 1) });
    }

    if (!checkCollision(piece, field, { x: 0, y: 1 })) {
        dispatch({ action: ACTIONS.REDUCE, type: 'SET_POS', pos: { x: 0, y: 1 }, collided: false });
    } else {
        // Game over !
        if (piece.pos.y < 1) {
            console.debug('GAME OVER !');
            dispatch({ action: ACTIONS.REDUCE, type: 'GAMEOVER' });
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: null });
        }
        dispatch({ action: ACTIONS.REDUCE, type: 'SET_POS', pos: { x: 0, y: 0 }, collided: true });
    }
};

const movePiece = (dispatch, piece, field, dir) => {
    if (!checkCollision(piece, field, { x: dir, y: 0 })) {
        dispatch({ action: ACTIONS.REDUCE, type: 'SET_POS', pos: { x: dir, y: 0 } });
    }
};

const dropPiece = (dispatch, field, piece, gameStatus) => {
    // When moving the piece down manually, we stop the interval drop time
    dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: null });
    drop(dispatch, field, piece, gameStatus);
};

const rotate = (matrix, dir) => {
    // Make the rows to become cols (transpose)
    const mtrx = matrix.map((_, index) => matrix.map(column => column[index]));
    // Reverse each row to get a rotaded matrix
    if (dir > 0) return mtrx.map(row => row.reverse());
    return mtrx.reverse();
};

const rotatePiece = (dispatch, field, piece, dir) => {
    const clonedPiece = JSON.parse(JSON.stringify(piece));
    clonedPiece.tetromino = rotate(clonedPiece.tetromino, dir);

    const pos = clonedPiece.pos.x;
    let offset = 1;
    while (checkCollision(clonedPiece, field, { x: 0, y: 0 })) {
        clonedPiece.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > clonedPiece.tetromino[0].length) {
            rotate(clonedPiece.tetromino, -dir);
            clonedPiece.pos.x = pos;
            return;
        }
    }

    dispatch({
        action: ACTIONS.REDUCE,
        type: 'SET_TETROMINO',
        tetromino: clonedPiece.tetromino,
        pos: clonedPiece.pos,
    });
};

const hardDrop = (dispatch, piece) => {
    dispatch({ action: ACTIONS.REDUCE, type: 'SET_TETROMINO', pos: piece.projection.pos });
};

export const move = (dispatch, { keyCode }, field, piece, gameStatus) => {
    if (!gameStatus.gameOver) {
        // left arrow
        if (keyCode === 37) movePiece(dispatch, piece, field, -1);
        // right arrow
        else if (keyCode === 39) movePiece(dispatch, piece, field, 1);
        // down arrow
        else if (keyCode === 40) dropPiece(dispatch, field, piece, gameStatus);
        // up arrow
        else if (keyCode === 38) rotatePiece(dispatch, field, piece, 1);
        // space bar
        else if (keyCode === 32) hardDrop(dispatch, piece);
    }
};
