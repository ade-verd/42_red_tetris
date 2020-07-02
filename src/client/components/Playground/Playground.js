import React, { useEffect, useRef, useState } from 'react';

import Field from './Field/Field';
import StartButton from './StartButton/StartButton';
import Display from './Display/Display';
import Spectrums from './Spectrums/Spectrums';

import { StyledPlayground } from './Playground.style';

import { getRoom } from '../../helpers/getRoom';

import { store } from '../../index';
import { useInterval } from '../../helpers/useInterval';

const Playground = props => {
    const { field, gameStatus, piece, spectrums, user, rooms, ...dispatchs } = props;
    const { score, rows, rowsCleared, level, gameOver } = gameStatus;
    const [isAdmin, setIsAdmin] = useState(false);
    const {
        listen,
        startGame,
        firstRender,
        emitGetRandomTetriminos,
        updateField,
        updateGameStatus,
        move,
        reactivateDropTime,
        drop,
    } = dispatchs;
    const playgroundRef = useRef(null);

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
        listen(playgroundRef);
        firstRender(store.dispatch);
        emitGetRandomTetriminos(store.dispatch, user.roomId, 1, 20);
    }, []);

    useEffect(() => {
        const currentRoom = getRoom(rooms.rooms, user.roomId);
        if (currentRoom) setIsAdmin(currentRoom.players_ids[0] === user.id);
    }, [rooms.rooms]);

    useEffect(() => {
        updateGameStatus(store.dispatch);
    }, [rowsCleared]);

    useEffect(() => {
        updateField(store.dispatch, field, piece);
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
            <Field field={field} />
            <aside>
                {gameOver ? (
                    <Display gameOver={gameOver} text="GAME OVER" />
                ) : (
                    <div>
                        <Display text={`Score: ${score}`} />
                        <Display text={`Rows: ${rows}`} />
                        <Display text={`Level: ${level}`} />
                    </div>
                )}
                {isAdmin ? (
                    <StartButton
                        callback={() =>
                            startGame(
                                store.dispatch,
                                user.roomId,
                                piece.pieces,
                                piece.index,
                                playgroundRef,
                            )
                        }
                    />
                ) : null}
            </aside>
        </StyledPlayground>
    );
};

export default Playground;
