import React from 'react';

import { StyledSpectrum, Row } from './Spectrum.style';
import Cell from './Cell/Cell';

const buildSpectrum = spectrum => {
    return spectrum.map(row => (
        <Row>
            {row.map((cell, x) => (
                <Cell key={x} status={cell} />
            ))}
        </Row>
    ));
};

const Spectrum = ({ spectrums, playerId }) => {
    const spectrum = spectrums[playerId];
    if (!spectrum) return null;

    return (
        <StyledSpectrum width={spectrum[0].length} height={spectrum.length}>
            {buildSpectrum(spectrum)}
        </StyledSpectrum>
    );
};

export default Spectrum;
