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

    return (
        <div>
            <label>Create player:</label>
            <input type="text" id="name" onKeyDown={onEnterkey} required />
            <br />
            <br />
            <Button variant="primary" onClick={goToPlayground}>
                Playground
            </Button>
        </div>
    );
};

export default Home;
