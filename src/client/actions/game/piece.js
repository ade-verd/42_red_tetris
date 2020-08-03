import { ACTIONS } from '../../middlewares/handleSocket';
const helper = require('../../helpers/checkCollision');

const incrementLevel = dispatch => {
    dispatch({ action: ACTIONS.REDUCE, type: 'INCREMENT_LEVEL' });
};

const setGameOver = dispatch => {
    dispatch({ action: ACTIONS.REDUCE, type: 'GAMEOVER' });
};

const reactivateDropTime = (dispatch, { keyCode }, gameStatus) => {
    const { level, gameWon, gameOver, playing } = gameStatus;
    if (!gameWon && !gameOver && playing) {
        // Activate the interval again when user releases down arrow or spacebar
        if (keyCode === 40 || keyCode === 32) {
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 / level });
        }
    }
};

const drop = (dispatch, field, piece, gameStatus) => {
    const { rows, level } = gameStatus;
    // Increase level when player has cleared 10 rows
    if (rows > level * 10) {
        incrementLevel(dispatch);
        // Also increase speed (+1 manually done because level not incremented instantly)
        dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 / (level + 1) });
    }

    if (!helper.checkCollision(piece, field, { x: 0, y: 1 })) {
        dispatch({ action: ACTIONS.REDUCE, type: 'SET_POS', pos: { x: 0, y: 1 }, collided: false });
    } else {
        // Game over !
        if (piece.pos.y < 1) {
            console.debug('GAME OVER !');
            setGameOver(dispatch);
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: null });
        }
        dispatch({ action: ACTIONS.REDUCE, type: 'SET_POS', pos: { x: 0, y: 0 }, collided: true });
    }
};

const movePiece = (dispatch, piece, field, dir) => {
    if (!helper.checkCollision(piece, field, { x: dir, y: 0 })) {
        dispatch({ action: ACTIONS.REDUCE, type: 'SET_POS', pos: { x: dir, y: 0 } });
    }
};

const dropPiece = (dispatch, field, piece, gameStatus) => {
    // When moving the piece down manually, we stop the interval drop time
    dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: null });
    thisFunctions.drop(dispatch, field, piece, gameStatus);
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
    clonedPiece.tetromino = thisFunctions.rotate(clonedPiece.tetromino, dir);

    const pos = clonedPiece.pos.x;
    let offset = 1;
    while (helper.checkCollision(clonedPiece, field, { x: 0, y: 0 })) {
        clonedPiece.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > clonedPiece.tetromino[0].length) {
            thisFunctions.rotate(clonedPiece.tetromino, -dir);
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
    const newPos = { x: 0, y: piece.projection.pos.y - piece.pos.y };

    dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: null });
    dispatch({ action: ACTIONS.REDUCE, type: 'SET_POS', pos: newPos, collided: true });
};

const move = (dispatch, event, field, piece, gameStatus) => {
    const { gameWon, gameOver, playing } = gameStatus;
    event.preventDefault();
    const { keyCode } = event;

    if (!gameWon && !gameOver && playing) {
        // left arrow
        if (keyCode === 37) thisFunctions.movePiece(dispatch, piece, field, -1);
        // right arrow
        else if (keyCode === 39) thisFunctions.movePiece(dispatch, piece, field, 1);
        // down arrow
        else if (keyCode === 40) thisFunctions.dropPiece(dispatch, field, piece, gameStatus);
        // up arrow
        else if (keyCode === 38) thisFunctions.rotatePiece(dispatch, field, piece, 1);
        // space bar
        else if (keyCode === 32) thisFunctions.hardDrop(dispatch, piece);
    }
};

const thisFunctions = {
    incrementLevel,
    setGameOver,
    reactivateDropTime,
    drop,
    movePiece,
    dropPiece,
    rotate,
    rotatePiece,
    hardDrop,
    move,
};
module.exports = thisFunctions;
