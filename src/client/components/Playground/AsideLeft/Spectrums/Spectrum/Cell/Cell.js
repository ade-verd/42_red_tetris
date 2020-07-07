import React from 'react';

import { StyledCell } from './Cell.style';

const COLORS = {
    clear: '0, 0, 0',
    merged: '204,0,0',
};

const Cell = ({ status }) => <StyledCell color={COLORS[status]} />;

export default React.memo(Cell);
