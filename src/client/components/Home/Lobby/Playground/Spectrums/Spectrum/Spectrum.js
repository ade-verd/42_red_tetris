import React, { useState, useEffect } from 'react';

import { StyledWrapper, StyledSpectrum, Row } from './Spectrum.style';
import Cell from './Cell/Cell';
import FieldMask from '../../FieldWrapper/Field/FieldMask/FieldMask';

import { FIELD_HEIGHT, FIELD_WIDTH } from '../../../../../../../constants/';

const buildEmptySpectrum = () =>
    Array.from(Array(FIELD_HEIGHT), () => new Array(FIELD_WIDTH).fill('clear'));

const buildSpectrum = spectrum => {
    return spectrum.map((row, y) => (
        <Row key={y}>
            {row.map((cell, x) => (
                <Cell key={x} status={cell} />
            ))}
        </Row>
    ));
};

const Spectrum = ({ players, spectrums, playerId }) => {
    let data = spectrums[playerId];
    if (!data) {
        const playerName = players[playerId];
        if (!playerName) return null;
        data = { spectrum: buildEmptySpectrum(), playerName, isGameOver: false };
    }

    const [gameOverContent, setGameOverContent] = useState();

    useEffect(() => {
        if (spectrums && spectrums[playerId]) {
            setGameOverContent(spectrums[playerId].isGameOver ? 'Game over' : '');
        }
    }, [data.isGameOver]);

    return (
        <StyledWrapper>
            <StyledSpectrum>
                <FieldMask
                    isSpectrum={true}
                    isGameOver={data.isGameOver}
                    content={gameOverContent}
                />
                {buildSpectrum(data.spectrum)}
            </StyledSpectrum>
            {data.playerName}
        </StyledWrapper>
    );
};

export default React.memo(Spectrum);
