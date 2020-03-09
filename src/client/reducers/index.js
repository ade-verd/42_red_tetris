import alertReducer from './alert';
import fieldReducer from './field';
import gameStatusReducer from './gameStatus';
import pieceReducer from './piece';
import playerReducer from './player';
import roomReducer from './room';
import userReducer from './user';

export default {
    alt: alertReducer,
    fld: fieldReducer,
    gme: gameStatusReducer,
    pce: pieceReducer,
    play: playerReducer,
    rms: roomReducer,
    usr: userReducer,
};
