export const storeStateMiddleWare = ({ getState }) => {
    return next => payload => {
        let returnValue = next(payload);

        const { action } = payload;
        const { field, piece, gameStatus } = getState();
        const { rows, level } = gameStatus;

        if (action.type === 'DROP') {
            if (rows > (level + 1) * 10) {
                // setLevel(prev => prev + 1);
                dispatch({ type: 'INCREMENT_LEVEL' });
                // Also increase speed
                // setDropTime(1000 / (level + 1) + 200);
                dispatch({ type: 'SET_DROPTIME', dropTime: 1000 / (level + 1) + 200});
            }
            
            if (!checkCollision(piece, field, { x: 0, y: 1 })) {
                console.log('droping')
                dispatch({ type: 'SET_POS', pos: { x: 0, y: 1} , collided: false });
                return state;
            } else {
                // Game over !
                if (piece.pos.y < 1) {
                    console.debug('GAME OVER !');
                    // setGameOver(true);
                    dispatch({ type: 'SET_GAMEOVER', gameOver: true });
                    // setDropTime(null);
                    dispatch({ type: 'SET_DROPTIME', dropTime: null });
                }
                // updatePlayerPos({ x: 0, y: 0, collided: true });
                dispatch({ type: 'SET_POS', pos: { x: 0, y: 0 }, collided: true });
            }
        }

        return returnValue;
    };
};
