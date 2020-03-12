import React from 'react';

import { StyledCell } from './Cell.style';
import { TETROMINOS } from '../../../../helpers/tetrominos';

const Cell = ({ type }) => <StyledCell type={type} color={TETROMINOS[type].color} />;

export default React.memo(Cell);
