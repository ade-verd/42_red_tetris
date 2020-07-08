import { connect } from 'react-redux';

import Playground from '../components/Playground/Playground';

import { emitGetRandomTetriminos, onGetRandomTetriminos } from '../actions/game/getTetriminos';
import { emitGameActionStart, onGameAction } from '../actions/game/gameAction';
import { firstRender } from '../actions/game/firstRender';
import { updateField } from '../actions/game/field';
import { startGame, onGameStart } from '../actions/game/gameStart';
import { updateGameStatus } from '../actions/game/gameStatus';
import { move, reactivateDropTime, drop } from '../actions/game/piece';
import { onSpectrum } from '../actions/game/spectrum';
import { onMalus } from '../actions/game/malus';

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
            onGameAction(dispatch);
            onGetRandomTetriminos(dispatch);
            onSpectrum(dispatch);
            onMalus(dispatch);
        },
        onStart: roomId => {
            emitGameActionStart(dispatch, roomId);
        },
        emitGetRandomTetriminos,
        startGame,
        firstRender,
        updateField,
        updateGameStatus,
        move,
        reactivateDropTime,
        drop,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Playground);
