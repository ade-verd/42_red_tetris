import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { createPlayer as createPlayerPayload } from '../actions/createPlayer';

import { ACTIONS } from '../middleware/handleSocket';

import './styles/Home.css';

let history = [];

const goToPlayground = () => {
    history.push({ pathname: '/playground' });
};

const goToRooms = () => {
    history.push({ pathname: '/rooms' });
};

const playerCreationError = players => {
    if (players && players.creationError) {
        const msg = 'An error occurred while creating the player. Please refresh and retry';
        return <div className="error">{msg}</div>;
    }
    return null;
};

const Home = ({ players, ...dispatchs }) => {
    useEffect(() => {
        dispatchs.listen();
    }, []);

    useEffect(() => {
        if (players && players.me !== undefined) return goToRooms();
    }, [players]);

    history = useHistory();

    const createPlayer = event => {
        if (event.key === 'Enter') {
            dispatchs.emitCreatePlayer(event.target.value);
        }
    };

    return (
        <div>
            <label>Create player:</label>
            <input type="text" id="name" onKeyDown={createPlayer} required />
            {playerCreationError(players)}
            <br />
            <Button variant="primary" onClick={goToRooms}>
                Rooms
            </Button>
            <br />
            <br />
            <Button variant="primary" onClick={goToPlayground}>
                Playground
            </Button>
        </div>
    );
};

const mapStateToProps = state => {
    console.debug('[Home][mapStateToProps] State', state);
    return { players: state.play.players };
};

const mapDispatchToProps = dispatch => {
    const emitCreatePlayer = playerName =>
        dispatch({
            action: ACTIONS.EMIT,
            event: 'players:create',
            data: createPlayerPayload(playerName),
        });

    return {
        emitCreatePlayer,
        listen: () => {
            dispatch({
                action: ACTIONS.LISTEN,
                event: 'players:created',
                fn: payload => {
                    dispatch({
                        action: ACTIONS.REDUCE,
                        type: 'PLAYER_CREATED',
                        player: payload.player,
                        error: payload.error,
                    });
                },
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
