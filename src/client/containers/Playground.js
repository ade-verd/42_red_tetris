import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';

import Field from '../components/Field';
import StartButton from '../components/StartButton';
import { StyledPlaygroundWrapper, StyledPlayground } from './styles/StyledPlayground';

import { alert } from '../actions/alert';
import { ping } from '../actions/server';

const socket = openSocket('http://localhost:3004');

socket.emit('action', ping());
console.log('OK2');

const Playground = ({ playing, message, field, piece, ...dispatchs }) => {
    console.log('OK1', playing);
    socket.on('server/start', () => {
        console.log('ENTERED SERVER/START on socket');
        dispatchs.onStart();
        dispatchs.onAlert();
    });
    console.log('[App] State = ', field, piece, dispatchs);

    useEffect(() => {
        console.log('useEffect');
        if (field) {
            console.log('piece inside useEffect', piece);
            dispatchs.fieldUpdate(piece);
        }
    }, [piece]);

    playing = 0;
    console.log('playing', playing);

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
    console.log('[mapStateToProps] State = ', state);
    return {
        message: state.alt.message,
        field: state.fld.field,
        piece: state.pce,
    };
};

console.log('OK4');

const mapDispatchToProps = dispatch => {
    return {
        onAlert: () => dispatch(alert('Soon, will be here a fantastic te-Tetris ...')),
        onStart: () => dispatch({ type: 'start' }),
        fieldUpdate: piece => dispatch({ type: 'update', piece: piece }),
    };
};

console.log('OK5');

export default connect(mapStateToProps, mapDispatchToProps)(Playground);

console.log('OK6');
