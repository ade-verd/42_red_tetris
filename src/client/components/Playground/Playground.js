import React, { useEffect, useRef, useState } from 'react';

import { StyledPlayground } from './Playground.style';

import AsideLeft from './AsideLeft/AsideLeft';
import Field from './Field/Field';
import AsideRight from './AsideRight/AsideRight';

import { getRoom } from '../../helpers/getRoom';
import { useInterval } from '../../helpers/useInterval';

import { store } from '../../store/store';

const Playground = props => {
    const { field, gameStatus, piece, spectrums, user, rooms, ...dispatchs } = props;
    const [isAdmin, setIsAdmin] = useState(false);
    const playgroundRef = useRef(null);
    const {
        listen,
        startGame,
        resetGame,
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
            <AsideLeft gameStatus={gameStatus} spectrums={spectrums} user={user} rooms={rooms} />
            <Field field={field} />
            <AsideRight
                gameOver={gameStatus.gameOver}
                isAdmin={isAdmin}
                dispatch={store.dispatch}
                user={user}
                piece={piece}
                playgroundRef={playgroundRef}
                startGame={startGame}
                resetGame={resetGame}
            />
        </StyledPlayground>
    );
};

export default Playground;
