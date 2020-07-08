import React from 'react';

import { StyledWrapper, StyledSpectrum, Row } from './Spectrum.style';
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
    const data = spectrums[playerId];
    if (!data) return null;

    return (
        <StyledWrapper>
            <StyledSpectrum>{buildSpectrum(data.spectrum)}</StyledSpectrum>
            {data.playerName}
        </StyledWrapper>
    );
};

export default React.memo(Spectrum);
