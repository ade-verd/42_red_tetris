import React from 'react';

import { StyledNextPiece, Row } from './NextPiece.style';

import Cell from './Cell/Cell';

const clearEmptyRows = piece => {
    const isNotClear = cell => cell !== 0;
    const reducer = (ack, row) => {
        // Check if the row is not clear, if it is, skip it
        if (row.findIndex(isNotClear) === -1) return ack;
        // Otherwise, add it
        ack.push(row);
        return ack;
    };

    return piece.reduce(reducer, []);
};

const clearEmptyColumns = piece => {
    // 1. Save in one array the columns that are empty or not
    const reducer = (ack, row) => {
        row.forEach((val, i) => (ack[i] = ack[i] || val));
        return ack;
    };
    const columns = piece.reduce(reducer, []);

    // 2. Then filter it by skiping the values in the empty index
    return piece.map(row => row.filter((_, i) => columns[i]));
};

const buildNextPiece = nextPiece => {
    let newNextPiece;
    newNextPiece = clearEmptyRows(nextPiece);
    newNextPiece = clearEmptyColumns(newNextPiece);

    return newNextPiece.map(row => (
        <Row>
            {row.map((cell, x) => (
                <Cell key={x} type={cell} />
            ))}
        </Row>
    ));
};

const NextPiece = ({ nextPiece }) => {
    return <StyledNextPiece>{buildNextPiece(nextPiece)}</StyledNextPiece>;
};

export default NextPiece;
