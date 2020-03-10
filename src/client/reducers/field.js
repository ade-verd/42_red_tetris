import { createField, updateField } from '../helpers/fieldHelper';

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'start':
            console.log('STARTED FIELD REDUCER');
            return {
                field: createField(),
            };
        case 'update':
            return {
                ...state,
                field: updateField(action.dispatch, state.field, action.piece),
            };
        default:
            return state;
    }
};

export default reducer;
