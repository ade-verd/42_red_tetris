import React from 'react';

import { StyledField, Row } from './Field.style';
import Cell from './Cell/Cell';

const buildField = field => {
    return field.map(row => (
        <Row>
            {row.map((cell, x) => (
                <Cell key={x} type={cell[0]} projection={cell[2]} />
            ))}
        </Row>
    ));
};

const Field = ({ field }) => {
    if (!field) return null;

    return <StyledField>{buildField(field)}</StyledField>;
};

export default Field;
