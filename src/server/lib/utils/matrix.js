const rotateSquareMatrix = (matrix, isClockwise = true) => {
    const rotatedMatrix = matrix.map((col, i) => matrix.map(row => row[i]));
    if (isClockwise) {
        return rotatedMatrix.map(row => row.reverse());
    }
    return rotatedMatrix.reverse();
};

module.exports = {
    rotateSquareMatrix,
};
