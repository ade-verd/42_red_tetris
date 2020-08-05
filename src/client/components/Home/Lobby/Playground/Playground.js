import React, { useEffect, useRef, useState } from 'react';

import { StyledPlayground } from './Playground.style';

import Confetti from './Confetti/Confetti';
import FieldWrapper from './FieldWrapper/FieldWrapper';
import Spectrums from './Spectrums/Spectrums';

import { getRoom } from '../../../../helpers/getRoom';
import { useInterval } from '../../../../helpers/useInterval';

import { store } from '../../../../store/store';

const Playground = props => {
    const { field, gameStatus, piece, players, rooms, spectrums, user, ...dispatchs } = props;
    const [isAdmin, setIsAdmin] = useState(false);
    const playgroundRef = useRef(null);
    const {
        listen,
        resetGame,
        emitGetRandomTetriminos,
        updateField,
        updateGameStatus,
        move,
        reactivateDropTime,
        drop,
    } = dispatchs;

    useEffect(() => {
        listen(playgroundRef);
        resetGame(store);
    }, []);

    useEffect(() => {
        const currentRoom = getRoom(rooms.rooms, user.roomId);
        if (currentRoom) setIsAdmin(currentRoom.players_ids[0] === user.id);
    }, [rooms.rooms]);

    useEffect(() => {
        if (isAdmin) emitGetRandomTetriminos(store.dispatch, user.roomId, 1, 20);
    }, [isAdmin]);

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
            <Confetti playgroundRef={playgroundRef} isGameWon={gameStatus.gameWon} />
            <Spectrums players={players} rooms={rooms} spectrums={spectrums} user={user} />
            <FieldWrapper {...props} isAdmin={isAdmin} playgroundRef={playgroundRef} />
        </StyledPlayground>
    );
};

export default React.memo(Playground);
