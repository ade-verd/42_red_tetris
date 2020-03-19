import { connect } from 'react-redux';

import Rooms from '../components/Rooms/Rooms';

import { emitCreateRoom, onRoomCreated } from '../actions/rooms/createRoom';
import { emitJoinRoom, onRoomJoined } from '../actions/rooms/joinRoom';
import { emitLeaveRoom, onRoomLeft } from '../actions/rooms/leaveRoom';
import { emitGetRoomPlayers, onGotRoomPlayers } from '../actions/rooms/getRoomPlayers';
import { emitGetActiveRooms, onGotActiveRooms } from '../actions/rooms/getActiveRooms';

import { store } from '../index';

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
            onRoomCreated(dispatch);
            onRoomJoined(dispatch);
            onRoomLeft(dispatch);
            onGotActiveRooms(dispatch);
            onGotRoomPlayers(store);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
