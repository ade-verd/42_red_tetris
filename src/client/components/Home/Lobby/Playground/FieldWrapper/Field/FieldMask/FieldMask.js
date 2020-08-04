import React, { useState, useEffect } from 'react';

import { StyledMask, StyledContent } from './FieldMask.style';

const FieldMask = ({ isSpectrum, isGameOver, content }) => {
    if (!content) return null;
    return (
        <StyledMask isGameOver={isGameOver}>
            <StyledContent isSpectrum={isSpectrum}>{content}</StyledContent>
        </StyledMask>
    );
};

export default FieldMask;
