import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const ConfettiWrapper = ({ isGameWon }) => {
    const [piecesNumber, setpiecesNumber] = useState(0);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (isGameWon) {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
    }, [isGameWon, window.innerHeight, window.innerWidth]);

    useEffect(() => {
        isGameWon ? setpiecesNumber(250) : setpiecesNumber(0);
    }, [isGameWon]);

    return (
        <Confetti
            width={size.width}
            height={size.height}
            numberOfPieces={piecesNumber}
            gravity={0.03}
            colors={[
                '#0072AF',
                '#0088D2',
                '#009DF3', // https://coolors.co/009df3
                '#1CAFFF',
                '#42BDFF',
                '#67CAFF',
                '#8DD7FF',
                '#B3E4FF',
                '#D9F2FF',
                '#FFFFFF',
            ]}
        />
    );
};

export default ConfettiWrapper;
