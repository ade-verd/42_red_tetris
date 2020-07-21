import { connect } from 'react-redux';

import Playground from '../components/Home/Lobby/Playground/Playground';

import { emitGetRandomTetriminos, onGetRandomTetriminos } from '../actions/game/getTetriminos';
import { emitGameAction, onGameAction } from '../actions/game/gameAction';
import { resetGame } from '../actions/game/gameReset';
import { updateField } from '../actions/game/field';
import { startGame, onGameStart } from '../actions/game/gameStart';
import { onGameReset } from '../actions/game/gameReset';
import { updateGameStatus } from '../actions/game/gameStatus';
import { move, reactivateDropTime, drop } from '../actions/game/piece';
import { onSpectrum } from '../actions/game/spectrum';
import { onMalus } from '../actions/game/malus';

import { GAME_ACTIONS } from '../../constants';

const mapStateToProps = state => {
    console.log('[Playground.container] State', state);
    return {
        field: state.fld.field,
        gameStatus: state.gme,
        piece: state.pce,
        spectrums: state.spe,
        user: state.usr,
        rooms: state.rms,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        listen: elementToFocus => {
            onGameStart(dispatch, elementToFocus);
            onGameReset(dispatch);
            onGameAction(dispatch);
            onGetRandomTetriminos(dispatch);
            onSpectrum(dispatch);
            onMalus(dispatch);
        },
        onStart: () => {
            emitGameAction(dispatch, GAME_ACTIONS.START);
        },
        emitGetRandomTetriminos,
        startGame,
        resetGame,
        updateField,
        updateGameStatus,
        move,
        reactivateDropTime,
        drop,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Playground);
