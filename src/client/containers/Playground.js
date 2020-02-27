import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';

import Field from '../components/Field';
import StartButton from '../components/StartButton';
import Display from '../components/Display';
import { StyledPlaygroundWrapper, StyledPlayground } from './styles/StyledPlayground';

import { getTetriminos } from '../actions/getTetriminos'
import { createRoom } from '../actions/createRoom'

import { alert } from '../actions/alert';
import { ping } from '../actions/server';

const socket = openSocket('http://localhost:3004');


socket.emit('action', ping());
socket.emit('rooms:create', createRoom('A good name for a room', '000000000000000000000001'));
// let roomId;
// socket.on('rooms:created', (payload) => {
// 	console.log(payload)
// 	roomId = payload.room_id
// });

// console.log(roomId)
console.log('OK2');

const Playground = ({ message, field, gameStatus, piece, ...dispatchs }) => {
		const { gameOver, score, rows, level } = gameStatus
		console.log('OK1');
		dispatchs.onStart();
    // socket.on('server/start', () => {
		// 		console.log('ENTERED SERVER/START on socket');
		// 		dispatchs.onStart();
    //     dispatchs.onAlert();
    // });
    console.log('[Playground] State: field =', field, 'gameStatus', gameStatus, 'piece =', piece, 'dispatchs =' , dispatchs);

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
										{gameOver ? (
											<Display gameOver={gameOver} text="Game Over" />
										) : (
											<div>
												<Display text={`Score: ${ score }`} />
												<Display text={`Rows: ${ rows }`} />
												<Display text={`Level: ${ level }`} />
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
    console.log('[mapStateToProps] State = ', state);
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
					dispatch({ event: 'server/start', handle: () => {
						dispatch(alert('Soon, will be here a fantastic te-Tetris ...'))
						dispatch({ emit: true, event: 'tetriminos:get_random', data: getTetriminos('5e5790717e915983669fa4b8', 1, 20) });
						dispatch({ event: 'tetriminos:get_random', handle: ({ pieces }) => { dispatch({ type: 'start', piece: pieces[0].shape }) }});
					}})
				},
        fieldUpdate: piece => dispatch({ type: 'update', piece: piece }),
    };
};

console.log('OK5');

export default connect(mapStateToProps, mapDispatchToProps)(Playground);

console.log('OK6');
