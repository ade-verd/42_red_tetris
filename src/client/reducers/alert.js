import { ALERT_POP } from '../actions/alert'

const reducer = (state = {} , action) => {
  switch(action.type){
    case ALERT_POP:
      return { ...state, message: action.message }
		case 'DB':
			return { ...state, db: action.db }
    default: 
      return state
  }
}

export default reducer

