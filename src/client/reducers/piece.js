import { FIELD_WIDTH } from '../helpers/fieldHelper';
import { randomTetromino } from '../helpers/tetrominos';
// const tetriminosLib = require('../../server/lib/tetriminos');

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'start':
						console.log('STARTED PIECE REDUCER');
            return {
                pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
								tetromino: action.piece,
								
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
