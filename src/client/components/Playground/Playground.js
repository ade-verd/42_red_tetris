import React, { useEffect } from 'react';

import Field from './Field/Field';
import StartButton from './StartButton/StartButton';
import Display from './Display/Display';

import { StyledPlaygroundWrapper, StyledPlayground } from './Playground.style';

import { store } from '../../index';

const Playground = props => {
    const { message, field, gameStatus, piece, user, ...dispatchs } = props;
    const { gameOver, score, rows, level } = gameStatus;

    // socket.on('server/start', () => {
    // 		console.log('ENTERED SERVER/START on socket');
    // 		dispatchs.onStart();
    //     dispatchs.onAlert();
    // });
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
        dispatchs.listen();
        dispatchs.onFirstRender(user.roomId, 1, 20);
    }, []);

    useEffect(() => {
        if (field) {
            console.log('piece inside useEffect', piece);
            dispatchs.fieldUpdate(store.dispatch, piece);
        }
    }, [piece]);

    return (
        <StyledPlaygroundWrapper>
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
