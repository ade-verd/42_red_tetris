import { combineReducers } from 'redux';

import chatReducer from './chat';
import fieldReducer from './field';
import gameStatusReducer from './gameStatus';
import highscoresReducer from './highscores';
import pieceReducer from './piece';
import spectrumsReducer from './spectrums';
import playerReducer from './player';
import roomReducer from './room';
import userReducer from './user';

export default combineReducers({
    cht: chatReducer,
    fld: fieldReducer,
    gme: gameStatusReducer,
    hgh: highscoresReducer,
    pce: pieceReducer,
    spe: spectrumsReducer,
    play: playerReducer,
    rms: roomReducer,
    usr: userReducer,
});
