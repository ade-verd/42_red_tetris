import React, { useState, useEffect } from 'react';

import { StyledField, Row } from './Field.style';
import Cell from './Cell/Cell';

const buildField = field => {
    return field.map((row, i) => (
        <Row key={`row_${i}`}>
            {row.map((cell, x) => (
                <Cell key={x} type={cell[0]} projection={cell[2]} />
            ))}
        </Row>
    ));
};

const Field = ({ field, gameStatus }) => {
    if (!field) return null;

    const [content, setContent] = useState();

    useEffect(() => {
        gameStatus.gameOver ? setContent('Game over') : setContent();
        console.log('ABC', content);
    }, [gameStatus.gameOver]);

    return (
        <StyledField gameOver={gameStatus.gameOver}>
            {buildField(field)}
            {content}
        </StyledField>
    );
};

export default Field;
