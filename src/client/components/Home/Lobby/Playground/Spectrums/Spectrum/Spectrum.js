import React from 'react';

import { StyledWrapper, StyledSpectrum, Row } from './Spectrum.style';
import Cell from './Cell/Cell';

import { FIELD_HEIGHT, FIELD_WIDTH } from '../../../../../../../constants/';

const buildEmptySpectrum = () =>
    Array.from(Array(FIELD_HEIGHT), () => new Array(FIELD_WIDTH).fill('clear'));

const buildSpectrum = spectrum => {
    return spectrum.map(row => (
        <Row>
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
        data = { spectrum: buildEmptySpectrum(), playerName };
    }

    return (
        <StyledWrapper>
            <StyledSpectrum>{buildSpectrum(data.spectrum)}</StyledSpectrum>
            {data.playerName}
        </StyledWrapper>
    );
};

export default React.memo(Spectrum);
