import React from 'react';

import { StyledCell } from './Cell.style';

const COLORS = {
    clear: '0, 0, 0',
    merged: '40, 40, 180',
};

const Cell = ({ status }) => <StyledCell color={COLORS[status]} />;

export default React.memo(Cell);
