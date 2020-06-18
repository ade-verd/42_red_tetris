import React from 'react';

import { StyledCell } from './Cell.style';
import { TETROMINOS } from '../../../../helpers/tetrominos';

const Cell = ({ type, projection }) => <StyledCell type={type} color={TETROMINOS[type].color} projection={projection} />;

export default React.memo(Cell);
