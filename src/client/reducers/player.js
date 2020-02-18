import { FIELD_WIDTH } from '../helpers/fieldHelper';
import { randomTetromino } from '../helpers/tetrominos';

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'start':
            console.log('STARTED PLAYER REDUCER');
            return {
                pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
                tetromino: randomTetromino().shape,
                collided: false,
            };
        case 'rotate':
            return {
                ...state,
                // player: updateField()
            };
        case 'reset':
            return {
                pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
                tetromino: randomTetromino().shape,
                collided: false,
            };
        default:
            return state;
    }
};

export default reducer;
