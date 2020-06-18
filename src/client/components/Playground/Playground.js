import React, { useEffect } from 'react';

import Field from './Field/Field';
import StartButton from './StartButton/StartButton';
import Display from './Display/Display';

import { StyledPlaygroundWrapper, StyledPlayground } from './Playground.style';

import { store } from '../../index';
import { useInterval } from '../../helpers/useInterval'
import { emitGetRandomTetriminos } from '../../actions/game/getTetriminos';

const Playground = props => {
    const { field, gameStatus, piece, user, ...dispatchs } = props;
    const { listen, startGame, firstRender, updateField, updateGameStatus, move, reactivateDropTime, drop } = dispatchs;
    const { score, rows, rowsCleared, level, gameOver } = gameStatus;

    console.debug(
        '[Playground] State: ', 
        'field =',
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
        emitGetRandomTetriminos(store.dispatch, user.roomId, 1, 20);
    }, []);

    useEffect(() => {
        updateGameStatus(store.dispatch)
    }, [rowsCleared]);

    useEffect(() => {
        updateField(store.dispatch, field, piece);
    }, [piece.tetromino, piece.pos]);

    useInterval(() => {
        drop(store.dispatch, field, piece, gameStatus);
    }, piece.dropTime);

    return (
        <StyledPlaygroundWrapper
            tabIndex="0"
            onKeyDown={event => move(store.dispatch, event, field, piece, gameStatus)}
            onKeyUp={event => reactivateDropTime(store.dispatch, event, gameStatus)}
        >
            <StyledPlayground>
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
                    <StartButton callback={() => startGame(store.dispatch)} />
                </aside>
            </StyledPlayground>
        </StyledPlaygroundWrapper>
    );
};

export default Playground;
