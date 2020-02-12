export const resetPlayer = () => {
	setPlayer({
		pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
		tetromino: randomTetromino().shape,
		collided: false
	})
}
