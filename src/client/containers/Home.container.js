import { connect } from 'react-redux';

import Home from '../components/Home/Home';

import { store } from '../index';

import {
    emitCreatePlayer,
    onPlayerCreated,
    checkUserCookie,
} from '../actions/players/createPlayer';
import { onGotPlayer } from '../actions/players/getPlayer';
import { socketIoConnect, onSocketConnect } from '../actions/common/connect';

const mapStateToProps = state => {
    console.debug('[Home][mapStateToProps] State', state);
    return { players: state.play.players, user: state.usr };
};

const mapDispatchToProps = dispatch => {
    return {
        checkUserCookie,
        emitCreatePlayer,
        socketIoConnect,
        listen: () => {
            onGotPlayer(store);
            onPlayerCreated(store);
            onSocketConnect(dispatch);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
