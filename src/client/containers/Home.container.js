import { connect } from 'react-redux';

import Home from '../components/Home/Home';

import { onChatMessageReceived } from '../actions/chat/chat';
import { emitCreatePlayer, onPlayerCreated } from '../actions/players/createPlayer';
import { onGotPlayers } from '../actions/players/getPlayers';
import { onRoomCreated } from '../actions/rooms/createRoom';
import { socketIoConnect, onSocketConnect } from '../actions/common/connect';

const mapStateToProps = state => {
    console.debug('[Home][mapStateToProps] State', state);
    return {
        chat: state.cht,
        highscores: state.hgh.highscores,
        players: state.play.players,
        rooms: state.rms,
        user: state.usr,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        emitCreatePlayer,
        socketIoConnect,
        listen: store => {
            onGotPlayers(dispatch);
            onChatMessageReceived(dispatch);
            onPlayerCreated(store);
            onRoomCreated(dispatch);
            onSocketConnect(dispatch);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
