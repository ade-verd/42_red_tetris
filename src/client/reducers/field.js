import { createField, updateField } from '../helpers/fieldHelper';

const reducer = (state = {}, action) => {
    console.log('[fieldReducer] State = ', state);
    switch (action.type) {
        case 'start':
            console.log('STARTED FIELD REDUCER');
            return {
                field: createField(),
            };
        case 'update':
            return {
                ...state,
                field: updateField(state.field, action.player),
            };
        default:
            return state;
    }
};

export default reducer;
