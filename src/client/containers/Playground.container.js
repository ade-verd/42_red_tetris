import { connect } from 'react-redux';

import Playground from '../components/Playground/Playground';

import { emitGetRandomTetriminos, onGetRandomTetriminos } from '../actions/game/getTetriminos';
import { firstRender } from '../actions/game/firstRender';
import { fieldUpdate } from '../actions/game/fieldUpdate';
import { movePiece, onKeyUp, drop } from '../actions/game/piece';
import { emitGameActionStart, onGameAction } from '../actions/game/gameAction';

const mapStateToProps = state => {
    console.log('[Playground] State', state);
    return {
        message: state.alt.message,
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
        firstRender,
        fieldUpdate,
        movePiece,
        onKeyUp,
        drop,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Playground);
