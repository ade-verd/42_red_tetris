import { connect } from 'react-redux';

import Rooms from '../components/Home/Lobby/Rooms/Rooms';

import { emitCreateRoom } from '../actions/rooms/createRoom';
import { emitJoinRoom, onRoomJoined } from '../actions/rooms/joinRoom';
import { emitLeaveRoom, onRoomLeft } from '../actions/rooms/leaveRoom';
import { emitGetRoomPlayers, onGotRoomPlayers } from '../actions/rooms/getRoomPlayers';
import { emitGetActiveRooms, onGotActiveRooms } from '../actions/rooms/getActiveRooms';

import { store } from '../store/store';

const mapStateToProps = state => {
    console.debug('[Rooms][mapStateToProps] State', state);
    return { rooms: state.rms.rooms, players: state.play.players };
};

const mapDispatchToProps = dispatch => {
    return {
        emitCreateRoom,
        emitJoinRoom,
        emitLeaveRoom,
        emitGetActiveRooms,
        emitGetRoomPlayers,
        listen: () => {
            onRoomJoined(dispatch);
            onRoomLeft(dispatch);
            onGotActiveRooms(dispatch);
            onGotRoomPlayers(store);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
