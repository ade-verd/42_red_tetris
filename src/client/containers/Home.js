import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Home = () => {
    const history = useHistory();

    const onEnterkey = event => {
        if (event.key === 'Enter') {
            history.push({
                pathname: '/rooms',
                name: event.target.value,
            });
        }
    };

    const goToPlayground = () => {
        history.push({ pathname: '/playground' });
    };

    const goToRooms = () => {
        history.push({ pathname: '/rooms' });
    };

    return (
        <div>
            <label>Create player:</label>
            <input type="text" id="name" onKeyDown={onEnterkey} required />
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

export default Home;
