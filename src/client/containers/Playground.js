import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';

import Field from '../components/Field';
import StartButton from '../components/StartButton';
import { StyledPlaygroundWrapper, StyledPlayground } from './styles/StyledPlayground';

import { getTetriminos } from '../actions/game/getTetriminos';
import { createRoom } from '../actions/rooms/createRoom';

import { alert } from '../actions/alert';
import { ping } from '../actions/server';

import { ACTIONS } from '../middleware/handleSocket';

const socket = openSocket('http://localhost:3004');

socket.emit('action', ping());
//socket.emit('rooms:create', createRoom('A good name for a room', '000000000000000000000001'));
// let roomId;
// socket.on('rooms:created', (payload) => {
// 	console.log(payload)
// 	roomId = payload.room_id
// });

// console.log(roomId)
console.log('OK2');

const Playground = ({ message, field, piece, ...dispatchs }) => {
    console.log('OK1');
    dispatchs.onStart();
    // socket.on('server/start', () => {
    // 		console.log('ENTERED SERVER/START on socket');
    // 		dispatchs.onStart();
    //     dispatchs.onAlert();
    // });
    console.log('[Playground] State: field =', field, 'piece =', piece, 'dispatchs =', dispatchs);

    useEffect(() => {
        console.log('useEffect');
        if (field) {
            console.log('piece inside useEffect', piece);
            dispatchs.fieldUpdate(piece);
        }
    }, [piece]);

    return (
        <StyledPlaygroundWrapper>
            <StyledPlayground>
                <p>{message}</p>
                <Field field={field} />
                <aside>
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
        piece: state.pce,
    };
};

console.log('OK4');

const mapDispatchToProps = dispatch => {
    return {
        // onAlert: () => dispatch(alert('Soon, will be here a fantastic te-Tetris ...')),
        onStart: () => {
            dispatch({
                action: ACTIONS.LISTEN,
                event: 'server/start',
                fn: () => {
                    dispatch(alert('Soon, will be here a fantastic te-Tetris ...'));
                    dispatch({
                        action: ACTIONS.EMIT,
                        event: 'tetriminos:get_random',
                        data: getTetriminos('5e5790717e915983669fa4b8', 1, 20),
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
            });
        },
        fieldUpdate: piece => dispatch({ action: ACTIONS.REDUCE, type: 'update', piece: piece }),
    };
};

console.log('OK5');

export default connect(mapStateToProps, mapDispatchToProps)(Playground);

console.log('OK6');
