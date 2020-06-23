const updateRowsScore = (state) => {
    if (state.rowsCleared === 0) {
        return state;
    }

    console.log('RORO,', state.rowsCleared)

    const linePoints = [40, 100, 300, 1200];

    return {
        ...state,
        score: state.score + linePoints[state.rowsCleared - 1] * (state.level + 1),
        rows: state.rows + state.rowsCleared,
    }
};


const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'FIRST_RENDER':
            return {
                score: 0,
                rows: 0,
                rowsCleared: 0,
                level: 1,
                gameOver: false,
            };
        case 'UPDATE_ROWS_SCORE':
            return updateRowsScore(state);
        case 'INCREMENT_LEVEL':
            return {
                ...state,
                level: state.level + 1,
            };
        case 'SET_ROWSCLEARED':
            return {
                ...state,
                rowsCleared: action.rowsCleared
            };
        case 'INCREMENT_ROWSCLEARED':
            return {
                ...state,
                rowsCleared: state.rowsCleared + 1,
            };
        case 'GAMEOVER':
            return {
                ...state,
                gameOver: true,
            };
        case 'RESET':
            return {
                score: 0,
                rows: 0,
                rowsCleared: 0,
                level: 1,
                gameOver: false,
            };
        default:
            return state;
    }
};

export default reducer;
