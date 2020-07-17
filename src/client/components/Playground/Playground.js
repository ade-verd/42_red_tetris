import React, { useEffect, useRef, useState } from 'react';

import { StyledPlayground } from './Playground.style';

import FieldWrapper from './FieldWrapper/FieldWrapper';
import Spectrums from './Spectrums/Spectrums';

import { getRoom } from '../../helpers/getRoom';
import { useInterval } from '../../helpers/useInterval';

import { store } from '../../store/store';

const Playground = props => {
    const { field, gameStatus, piece, spectrums, user, rooms, ...dispatchs } = props;
    const [isAdmin, setIsAdmin] = useState(false);
    const playgroundRef = useRef(null);
    const {
        listen,
        emitGetRandomTetriminos,
        updateField,
        updateGameStatus,
        move,
        reactivateDropTime,
        drop,
    } = dispatchs;

    console.debug(
        '[Playground] State: ',
        'store =',
        store.getState(),
        'field =',
        field,
        'gameStatus',
        gameStatus,
        'piece =',
        piece,
        'spectrums =',
        spectrums,
        'rooms =',
        rooms,
        'dispatchs =',
        dispatchs,
    );

    useEffect(() => {
        const currentRoom = getRoom(rooms.rooms, user.roomId);
        if (currentRoom) setIsAdmin(currentRoom.players_ids[0] === user.id);
    }, [rooms.rooms]);

    useEffect(() => {
        if (isAdmin) emitGetRandomTetriminos(store.dispatch, user.roomId, 1, 20);
    }, [isAdmin]);

    useEffect(() => {
        listen(playgroundRef);
        resetGame(store.dispatch);
    }, []);

    useEffect(() => {
        updateGameStatus(store.dispatch);
    }, [gameStatus.rowsCleared]);

    useEffect(() => {
        updateField(store.dispatch);
    }, [piece.tetromino, piece.pos]);

    useInterval(() => {
        drop(store.dispatch, field, piece, gameStatus);
    }, piece.dropTime);

    return (
        <StyledPlayground
            tabIndex="0"
            ref={playgroundRef}
            onKeyDown={event => move(store.dispatch, event, field, piece, gameStatus)}
            onKeyUp={event => reactivateDropTime(store.dispatch, event, gameStatus)}
        >
            <Spectrums spectrums={spectrums} user={user} rooms={rooms} />
            <FieldWrapper {...props} isAdmin={isAdmin} playgroundRef={playgroundRef} />
        </StyledPlayground>
    );
};

export default Playground;
