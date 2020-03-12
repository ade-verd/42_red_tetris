import React from 'react';
import { StyledDisplay } from './Display.style';

const Display = ({ gameOver, text }) => <StyledDisplay gameOver={gameOver}>{text}</StyledDisplay>;

export default Display;
