import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { createPlayer as createPlayerPayload } from '../actions/createPlayer';

import { ACTIONS } from '../middleware/handleSocket';

let history = [];

const goToPlayground = () => {
    history.push({ pathname: '/playground' });
};

const goToRooms = () => {
    history.push({ pathname: '/rooms' });
};

const Home = ({ players, user, ...dispatchs }) => {
    useEffect(() => {
        dispatchs.listen();
    }, []);

    useEffect(() => {
        if (user && user.id !== undefined) return goToRooms();
    }, [user]);

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
    return { players: state.play.players, user: state.usr };
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
