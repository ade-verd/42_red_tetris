import React, { useEffect } from 'react';

import { StyledField, Row } from './Field.style';
import Cell from './Cell/Cell';

const buildField = field => {
    console.log('FFF', field);
    return field.map(row => (
        <Row>
            {row.map((cell, x) => (
                <Cell key={x} type={cell[0]} />
            ))}
        </Row>
    ));
};

const Field = ({ field }) => {
    if (!field) return null;

    return (
        <StyledField width={field[0].length} height={field.length}>
            {buildField(field)}
        </StyledField>
    );
};

export default Field;
