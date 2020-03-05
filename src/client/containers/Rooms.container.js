import { connect } from 'react-redux';

import Rooms from '../components/Rooms/Rooms';

import { emitCreateRoom, onRoomCreated } from '../actions/rooms/createRoom';
import { emitJoinRoom, onRoomJoined } from '../actions/rooms/joinRoom';
import { emitGetRoomPlayers, onGotRoomPlayers } from '../actions/rooms/getRoomPlayers';
import { emitGetActiveRooms, onGotActiveRooms } from '../actions/rooms/getActiveRooms';

const mapStateToProps = state => {
    console.debug('[Rooms][mapStateToProps] State', state);
    return { rooms: state.rms.rooms, players: state.play.players };
};

const mapDispatchToProps = dispatch => {
    return {
        emitCreateRoom,
        emitJoinRoom,
        emitGetActiveRooms,
        emitGetRoomPlayers,
        listen: () => {
            onRoomCreated(dispatch);
            onRoomJoined(dispatch);
            onGotActiveRooms(dispatch);
            onGotRoomPlayers(dispatch);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
