import { connect } from 'react-redux';

import Home from '../components/Home/Home';

import { onChatMessageReceived } from '../actions/chat/chat';
import { emitCreatePlayer, onPlayerCreated } from '../actions/players/createPlayer';
import { onGotPlayers } from '../actions/players/getPlayers';
import { onRoomCreated } from '../actions/rooms/createRoom';
import { socketIoConnect, onSocketConnect } from '../actions/common/connect';
import { onPong } from '../actions/common/latency';

const mapStateToProps = state => {
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
            onPong(dispatch);
            onRoomCreated(dispatch);
            onSocketConnect(store);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
