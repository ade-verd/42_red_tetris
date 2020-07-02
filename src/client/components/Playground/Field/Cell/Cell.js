import React from 'react';

import { StyledCell } from './Cell.style';
import { TETRIMINOS } from '../../../../../constants/tetriminos';

const Cell = ({ type, projection }) => (
    <StyledCell type={type} color={TETRIMINOS[type].color} projection={projection} />
);

export default React.memo(Cell);
