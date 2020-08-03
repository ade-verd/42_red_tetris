const checkCollision = (piece, field, { x: moveX, y: moveY }) => {
    // Using for loops to be able to return (and break). Not possible with forEach
    for (let y = 0; y < piece.tetromino.length; y += 1) {
        for (let x = 0; x < piece.tetromino[y].length; x += 1) {
            // 1. Check that we're on an actual Tetromino cell
            if (piece.tetromino[y][x] !== 0) {
                if (
                    // 2. Check that our move is inside the game areas height (y)
                    // That we're not go through bottom of the play area
                    !field[y + piece.pos.y + moveY] ||
                    // 3. Check that our move is inside the game areas width (x)
                    !field[y + piece.pos.y + moveY][x + piece.pos.x + moveX] ||
                    // 4. Check that the cell wer'e moving to isn't set to clear
                    field[y + piece.pos.y + moveY][x + piece.pos.x + moveX][1] !== 'clear'
                ) {
                    return true;
                }
            }
        }
    }
    // 5. If everything above is false
    return false;
};

module.exports = {
    checkCollision,
};
