const rotate = (matrix, dir) => {
    // Make the rows to become cols (transpose)
    const rotatedTetro = matrix.map((_, index) => matrix.map(col => col[index]));
    // Reverse each row to get a rotated matrix
    if (dir > 0) return rotatedTetro.map(row => row.reverse());
    return rotatedTetro.reverse();
};

const pieceRotate = (stage, dir) => {
    const clonedPiece = JSON.parse(JSON.stringify(piece));
    clonedPiece.tetromino = rotate(clonedPiece.tetromino, dir);

    const pos = clonedPiece.pos.x;
    let offset = 1;
    while (checkCollision(clonedPiece, stage, { x: 0, y: 0 })) {
        clonedPiece.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > clonedPiece.tetromino[0].length) {
            rotate(clonedPiece.tetromino, -dir);
            clonedPiece.pos.x = pos;
            return;
        }
    }
    setPlayer(clonedPiece);
};

const updatePiecePos = ({ x, y, collided }) => {
    setPlayer(prev => ({
        ...prev,
        pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
        collided,
    }));
};

export const resetPlayer = () => {
    setPlayer({
        pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
        tetromino: randomTetromino().shape,
        collided: false,
    });
};
