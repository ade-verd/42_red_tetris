import React, { useState, useEffect } from 'react';

import { StyledHighscores } from './Highscores.style';
import Highscore from './Highscore/Highscore';

import { emitGetHighscores, onHighscores } from '../../../../../../actions/highscores/highscores';

import { store } from '../../../../../../store/store';

const Highscores = ({ highscores }) => {
    useEffect(() => {
        onHighscores(store.dispatch);
        emitGetHighscores(store.dispatch);
    }, []);

    useEffect(() => {
        console.debug('[Highscores] rendering');
    }, [highscores]);

    return (
        <StyledHighscores>
            {highscores && highscores.length ? (
                highscores
                    .filter(item => item.score > 0)
                    .map((highscore, i) => (
                        <Highscore key={`highscore_${i}`} highscore={highscore} index={i} />
                    ))
            ) : (
                <Highscore />
            )}
        </StyledHighscores>
    );
};

export default Highscores;
