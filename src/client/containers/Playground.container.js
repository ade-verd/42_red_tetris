import { connect } from 'react-redux';

import Playground from '../components/Home/Lobby/Playground/Playground';

import { emitGetRandomTetriminos, onGetRandomTetriminos } from '../actions/game/getTetriminos';
import { emitGameAction, onGameAction } from '../actions/game/gameAction';
import { updateField } from '../actions/game/field';
import { startGame, onGameStart } from '../actions/game/gameStart';
import { resetGame, onGameReset } from '../actions/game/gameReset';
import { updateGameStatus } from '../actions/game/gameStatus';
import { move, reactivateDropTime, drop } from '../actions/game/piece';
import { onSpectrum } from '../actions/game/spectrum';
import { onMalus } from '../actions/game/malus';
import { onGameWon } from '../actions/game/status';

import { GAME_ACTIONS } from '../../constants';

import { store } from '../store/store';

const mapStateToProps = state => {
    return {
        field: state.fld.field,
        gameStatus: state.gme,
        piece: state.pce,
        players: state.play.players,
        rooms: state.rms,
        spectrums: state.spe,
        user: state.usr,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        listen: elementToFocus => {
            onGameStart(dispatch, elementToFocus);
            onGameReset(dispatch);
            onGameWon(dispatch);
            onGameAction(dispatch);
            onGetRandomTetriminos(dispatch);
            onSpectrum(dispatch);
            onMalus(store);
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
