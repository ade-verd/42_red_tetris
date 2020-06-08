import { combineReducers } from 'redux';

import alertReducer from './alert';
import chatReducer from './chat';
import fieldReducer from './field';
import gameStatusReducer from './gameStatus';
import pieceReducer from './piece';
import playerReducer from './player';
import roomReducer from './room';
import userReducer from './user';

export default combineReducers({
    alt: alertReducer,
    cht: chatReducer,
    fld: fieldReducer,
    gme: gameStatusReducer,
    pce: pieceReducer,
    play: playerReducer,
    rms: roomReducer,
    usr: userReducer,
});
