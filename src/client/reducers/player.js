import { FIELD_WIDTH } from '../helpers/fieldHelper'
import { randomTetromino } from '../helpers/tetrominos'

// const initialState = {
// 	field: createField()
// }

// WIP

const reducer = (state = {}, action) => {
	switch (action.type) {
		case 'start':
			console.log('STARTED PLAYER REDUCER')
			return {
				pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
				tetromino: randomTetromino(),
				collided: false
			}
		case 'rotate':
			return {
				...state,
				// player: updateField()
			}
		default:
			return state
	}
}

export default reducer
