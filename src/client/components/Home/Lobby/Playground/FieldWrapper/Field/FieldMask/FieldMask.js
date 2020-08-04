import React, { useState, useEffect } from 'react';

import { StyledMask, StyledContent } from './FieldMask.style';

const FieldMask = ({ isGameOver, content }) => {
    if (!content) return null;
    return (
        <StyledMask isGameOver={isGameOver}>
            <StyledContent>{content}</StyledContent>
        </StyledMask>
    );
};

export default FieldMask;
