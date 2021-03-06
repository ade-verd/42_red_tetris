import React from 'react';

import { StyledCell } from './Cell.style';
import { TETRIMINOS } from '../../../../../../../../../constants';

const Cell = ({ type }) => <StyledCell type={type} color={TETRIMINOS[type].color} />;

export default React.memo(Cell);
