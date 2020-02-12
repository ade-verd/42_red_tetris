import { createField, updateField } from '../helpers/fieldHelper'

// const initialState = {
// 	field: createField()
// }

// WIP

const reducer = (state = {}, action) => {
	switch (action.type) {
		case 'start':
			console.log('STARTED FIELD REDUCER')
			return {
				...state,
				field: createField()
			}
		case 'update':
			return {
				...state,
				field: updateField(state.field, action.payload)
			}
		default:
			return state
	}
}

export default reducer
