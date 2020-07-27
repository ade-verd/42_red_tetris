import React, { useState, useEffect } from 'react';

import { StyledHighscores } from './Highscores.style';
import Highscore from './Highscore/Highscore';

import { emitGetHighscores, onHighscores } from '../../../../../../actions/highscores/highscores';

import { store } from '../../../../../../store/store';

const Highscores = () => {
    const [highscores, setHighscores] = useState(null);

    useEffect(() => {
        onHighscores(store.dispatch, setHighscores);
        emitGetHighscores(store.dispatch);
    }, []);

    useEffect(() => {
        console.debug('[Highscores] rendering');
    }, [highscores]);

    return (
        <StyledHighscores>
            {highscores
                ? highscores.map((highscore, i) => (
                      <Highscore key={`highscore_${i}`} highscore={highscore} index={i} />
                  ))
                : null}
        </StyledHighscores>
    );
};

export default Highscores;
