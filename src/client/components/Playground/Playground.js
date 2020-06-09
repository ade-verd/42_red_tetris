import React, { useEffect } from 'react';

import Field from './Field/Field';
import StartButton from './StartButton/StartButton';
import Display from './Display/Display';

import { StyledPlaygroundWrapper, StyledPlayground } from './Playground.style';

import { store } from '../../index';

const Playground = props => {
    const { message, field, gameStatus, piece, user, ...dispatchs } = props;
    const { listen, useInterval, firstRender, fieldUpdate, movePiece, onKeyUp, drop } = dispatchs;
    const { gameOver, score, rows, level } = gameStatus;

    console.log(
        '[Playground] State: field =',
        field,
        'gameStatus',
        gameStatus,
        'piece =',
        piece,
        'dispatchs =',
        dispatchs,
    );

    useEffect(() => {
        listen();
        firstRender(store.dispatch);
    }, []);

    useEffect(() => {
        console.log('useEffect update', field, piece)
        fieldUpdate(store.dispatch, field, piece);
    }, [piece.tetromino, piece.pos]);

    useInterval(() => {
        drop(store.dispatch, field, piece, gameStatus);
    }, piece.dropTime);

    return (
        <StyledPlaygroundWrapper
            onKeyDown={e => movePiece(store.dispatch, e, gameStatus)}
            onKeyUp={key => onKeyUp(store.dispatch, key, gameStatus)}
        >
            <StyledPlayground>
                <p>{message}</p>
                <Field field={field} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                        </div>
                    )}
                    <StartButton callback={dispatchs.onStart} />
                </aside>
            </StyledPlayground>
        </StyledPlaygroundWrapper>
    );
};

export default Playground;
