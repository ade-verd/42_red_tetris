import React, { useEffect } from 'react';

import Field from './Field/Field';
import StartButton from './StartButton/StartButton';
import Display from './Display/Display';

import { StyledPlaygroundWrapper, StyledPlayground } from './Playground.style';

import { store } from '../../index';
import { useInterval } from '../../helpers/useInterval'
import { emitGetRandomTetriminos } from '../../actions/game/getTetriminos';

import { ACTIONS } from '../../middleware/handleSocket'

const Playground = props => {
    const { message, field, gameStatus, piece, user, ...dispatchs } = props;
    const { listen, firstRender, fieldUpdate, movePiece, onKeyUp, drop } = dispatchs;
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
        console.log('ONUR', piece)
        emitGetRandomTetriminos(store.dispatch, user.roomId, piece.index + 1, piece.amount);
        console.log('emit done')
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
                    <StartButton 
                        callback={() => {
                            store.dispatch({ action: ACTIONS.REDUCE, type: 'SET_TETROMINO' });
                            store.dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 });
                        }}
                    />
                </aside>
            </StyledPlayground>
        </StyledPlaygroundWrapper>
    );
};

export default Playground;
