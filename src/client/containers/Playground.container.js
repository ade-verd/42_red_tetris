import { connect } from 'react-redux';

import Playground from '../components/Playground/Playground';

import { emitGetRandomTetriminos, onGetRandomTetriminos } from '../actions/game/getTetriminos';
import { fieldUpdate } from '../actions/game/fieldUpdate';
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
        onFirstRender: (roomId, piecePosition, piecesAmount) => {
            emitGetRandomTetriminos(dispatch, roomId, piecePosition, piecesAmount);
        },
        onStart: roomId => {
            emitGameActionStart(dispatch, roomId);
        },
        fieldUpdate,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Playground);
