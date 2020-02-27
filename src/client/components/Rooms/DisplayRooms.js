import React from 'react';

import { MAX_PLAYERS } from '../../../constants';
import './DisplayRooms.css';

const Row = props => {
    const className = props.isTitle ? 'title-bar room-container' : 'room-container';
    const nameValue = props.name || 'name';
    const playersValue = props.playersNumber
        ? `${props.playersNumber} / ${MAX_PLAYERS}`
        : 'players';
    const statusValue = props.status || 'status';

    return (
        <div className={className}>
            <div className="item">{nameValue}</div>
            <div className="item">{playersValue}</div>
            <div className="item">{statusValue}</div>
        </div>
    );
};

const buildHeadTable = () => <Row key={new Date().valueOf()} isTitle="true" />;

const buildRoomsTable = activeRooms => {
    if (typeof activeRooms === 'null' || typeof activeRooms === 'undefined') return [];

    const activeRoomsArray = Object.values(activeRooms);
    return activeRoomsArray.map(room => {
        return (
            <Row
                key={room._id}
                name={room.room_name}
                status={room.game_status}
                playersNumber={room.players_ids.length}
            />
        );
    });
};

const ActiveRooms = props => {
    const headTable = buildHeadTable();
    const roomsTable = buildRoomsTable(props.activeRooms);

    const table = [headTable, ...roomsTable];
    console.log('table', table);
    return <div className="main-container">{table.map(row => row)}</div>;
};

export default ActiveRooms;
