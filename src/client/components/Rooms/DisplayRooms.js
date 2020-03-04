import React from 'react';
import { Accordion, Button } from 'react-bootstrap';

import { emitJoinRoom } from '../../actions/joinRoom';
import { store } from '../../index';

import { MAX_PLAYERS } from '../../../constants';
import './DisplayRooms.css';

const roomJoinedError = () => {
    const roomState = store.getState().rms.rooms;

    if (roomState && roomState.roomJoinedError) {
        return <div className="error">{roomState.roomJoinedError}</div>;
    }
    return null;
};

const buildCollapsedCard = (eventKey, playersIds, roomId, state) => {
    if (!playersIds) return;

    const playersState = state.play.players;

    const formattedNames = playersIds.map(id => {
        const name = (playersState && playersState[id]) || `GUEST_${(Math.random() * 100) | 0}`;
        return <div>{name}</div>;
    });

    return (
        <Accordion.Collapse eventKey={eventKey}>
            <div className="row-container details">
                <div className="details hidden"></div>
                <div className="details">{formattedNames}</div>
                <div className="details">
                    <Button variant="primary" onClick={() => emitJoinRoom(store, roomId)}>
                        Join
                    </Button>
                    {roomJoinedError()}
                </div>
            </div>
        </Accordion.Collapse>
    );
};

const Row = props => {
    const state = store.getState();
    const className = props.isTitle ? 'title-bar row-container' : 'row-container room';
    const roomId = props.roomId;
    const eventKey = `evt_${roomId}`;
    const nameValue = props.name || 'name';
    const playersIds = props.playersIds;
    const playersNumber = props.playersIds
        ? `${props.playersIds.length} / ${MAX_PLAYERS}`
        : 'players';
    const statusValue = props.status || 'status';

    return (
        <Accordion>
            <Accordion.Toggle as="div" className={className} eventKey={eventKey}>
                <div className="item">{nameValue}</div>
                <div className="item">{playersNumber}</div>
                <div className="item">{statusValue}</div>
            </Accordion.Toggle>
            {buildCollapsedCard(eventKey, playersIds, roomId, state)}
        </Accordion>
    );
};

const buildHeadTable = () => <Row key={new Date().valueOf()} isTitle="true" />;

const buildRoomsTable = (activeRooms, dispatchs) => {
    if (typeof activeRooms === 'null' || typeof activeRooms === 'undefined') return [];

    const activeRoomsArray = Object.values(activeRooms);
    return activeRoomsArray.map(room => {
        return (
            <Row
                key={`row_${room._id}`}
                roomId={room._id}
                name={room.room_name}
                status={room.game_status}
                playersIds={room.players_ids}
            />
        );
    });
};

const ActiveRooms = props => {
    const headTable = buildHeadTable();
    const roomsTable = buildRoomsTable(props.activeRooms, props.dispatchs);

    const table = [headTable, ...roomsTable];
    return <div className="main-container">{table.map(row => row)}</div>;
};

export default ActiveRooms;
