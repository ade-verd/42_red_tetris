import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

import { MAX_PLAYERS } from '../../../constants';
import './DisplayRooms.css';

const buildCollapsedCard = (eventKey, playersNames) => {
    if (!playersNames) return;

    const formattedNames = playersNames.map(name => <div>{name}</div>);

    return (
        <Accordion.Collapse eventKey={eventKey}>
            <div>{formattedNames}</div>
        </Accordion.Collapse>
    );
};

const Row = props => {
    const className = props.isTitle ? 'title-bar row-container' : 'row-container room';
    const eventKey = `evt_${props.roomId}`;
    const nameValue = props.name || 'name';
    const playersNames = props.players;
    const playersNumber = props.players ? `${props.players.length} / ${MAX_PLAYERS}` : 'players';
    const statusValue = props.status || 'status';

    return (
        <Accordion>
            <Accordion.Toggle as="div" className={className} eventKey={eventKey}>
                <div className="item">{nameValue}</div>
                <div className="item">{playersNumber}</div>
                <div className="item">{statusValue}</div>
            </Accordion.Toggle>
            {buildCollapsedCard(eventKey, playersNames)}
        </Accordion>
    );
};

const buildHeadTable = () => <Row key={new Date().valueOf()} isTitle="true" />;

const buildRoomsTable = activeRooms => {
    if (typeof activeRooms === 'null' || typeof activeRooms === 'undefined') return [];

    const activeRoomsArray = Object.values(activeRooms);
    return activeRoomsArray.map(room => {
        return (
            <Row
                key={`row_${room._id}`}
                roomId={room._id}
                name={room.room_name}
                status={room.game_status}
                players={room.players_ids}
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
