import { FIELD_WIDTH } from '../helpers/fieldHelper';
import { randomTetromino } from '../helpers/tetrominos';
<<<<<<< HEAD:src/client/reducers/piece.js
// const tetriminosLib = require('../../server/lib/tetriminos');
=======
const tetriminosLib = require('../../server/lib/tetriminos');
>>>>>>> 874e1fa16b3399184cf81430f4af7e3a8cce9729:src/client/reducers/piece.js

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'start':
						console.log('STARTED PIECE REDUCER');
            return {
                pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
<<<<<<< HEAD:src/client/reducers/piece.js
								tetromino: action.piece,
								
=======
                tetromino: tetriminosLib.getRandomTetrimino().shape,
>>>>>>> 874e1fa16b3399184cf81430f4af7e3a8cce9729:src/client/reducers/piece.js
                collided: false,
            };
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
