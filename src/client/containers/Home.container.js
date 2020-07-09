import { connect } from 'react-redux';

import Home from '../components/Home/Home';

import { onChatMessageReceived } from '../actions/chat/chat';
import {
    emitCreatePlayer,
    onPlayerCreated,
    checkUserCookie,
} from '../actions/players/createPlayer';
import { onGotPlayers } from '../actions/players/getPlayers';
import { socketIoConnect, onSocketConnect } from '../actions/common/connect';

const mapStateToProps = state => {
    console.debug('[Home][mapStateToProps] State', state);
    return { players: state.play.players, user: state.usr, rooms: state.rms, chat: state.cht };
};

const mapDispatchToProps = dispatch => {
    return {
        checkUserCookie,
        emitCreatePlayer,
        socketIoConnect,
        listen: store => {
            onGotPlayers(dispatch);
            onChatMessageReceived(dispatch);
            onPlayerCreated(store);
            onSocketConnect(dispatch);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
