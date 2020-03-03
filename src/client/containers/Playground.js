import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';

import Field from '../components/Field';
import StartButton from '../components/StartButton';
import Display from '../components/Display';
import { StyledPlaygroundWrapper, StyledPlayground } from './styles/StyledPlayground';

import { getTetriminos } from '../actions/getTetriminos';
import { createRoom } from '../actions/createRoom';

import { alert } from '../actions/alert';
import { ping } from '../actions/server';

import { ACTIONS } from '../middleware/handleSocket';

const socket = openSocket('http://localhost:3004');

socket.emit('started', ping());
socket.emit('rooms:create', createRoom('A good name for a room', '000000000000000000000001'));
// let roomId;
// socket.on('rooms:created', (payload) => {
// 	console.log(payload)
// 	roomId = payload.room_id
// });

// console.log(roomId)
console.log('OK2');

const Playground = props => {
    const { message, field, gameStatus, piece, ...dispatchs } = props;
    const { gameOver, score, rows, level } = gameStatus;
    console.log('OK1');

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
        console.debug('[Rooms] ONLY FIRST TIME');
        dispatchs.onStart();
    }, []);

    useEffect(() => {
        if (field) {
            console.log('piece inside useEffect', piece);
            dispatchs.fieldUpdate(piece);
        }
		}, [piece]);

    return (
        <StyledPlaygroundWrapper>
            <StyledPlayground>
								<p>{ message }</p>
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

console.log('OK3');

const mapStateToProps = state => {
    console.log('[Playground][mapStateToProps] State = ', state);
    return {
        message: state.alt.message,
        field: state.fld.field,
        gameStatus: state.gme,
        piece: state.pce,
    };
};

console.log('OK4');

const mapDispatchToProps = dispatch => {
    return {
        // onAlert: () => dispatch(alert('Soon, will be here a fantastic te-Tetris ...')),
        onStart: () => {
            dispatch(alert('Soon, will be here a fantastic te-Tetris ...'));
            dispatch({
                action: ACTIONS.EMIT,
                event: 'tetriminos:get_random',
                data: getTetriminos('5e5e2ca499f73384033175fb', 1, 20),
            });
            dispatch({
                action: ACTIONS.LISTEN,
                event: 'tetriminos:get_random',
                fn: ({ pieces }) => {
                    dispatch({
                        action: ACTIONS.REDUCE,
                        type: 'start',
                        piece: pieces[0].shape,
                    });
                },
            });
        },
        fieldUpdate: piece => dispatch({ action: ACTIONS.REDUCE, type: 'update', piece: piece }),
    };
};

console.log('OK5');

export default connect(mapStateToProps, mapDispatchToProps)(Playground);

console.log('OK6');
