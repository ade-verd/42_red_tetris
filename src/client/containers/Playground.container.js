import { connect } from 'react-redux';

import Playground from '../components/Playground/Playground';

import { emitGetRandomTetriminos, onGetRandomTetriminos } from '../actions/game/getTetriminos';
import { emitGameActionStart, onGameAction } from '../actions/game/gameAction';
import { firstRender } from '../actions/game/firstRender';
import { startGame, updateField } from '../actions/game/field';
import { updateGameStatus } from '../actions/game/gameStatus';
import { move, reactivateDropTime, drop } from '../actions/game/piece';

const mapStateToProps = state => {
    console.log('[Playground.container] State', state);
    return {
        field: state.fld.field,
        gameStatus: state.gme,
        piece: state.pce,
        user: state.usr,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        listen: () => {
            onGameAction(dispatch);
            onGetRandomTetriminos(dispatch);
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
