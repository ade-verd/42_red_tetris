// import React, { useEffect, useRef, useState } from 'react';
// import useWindowSize from 'react-use-window-size';
// import Confetti from 'react-confetti';

// const ConfettiWrapper = ({ playgroundRef, isGameWon }) => {
//     const [run, setRun] = useState(false);

//     const { width, height } = useWindowSize();

//     useEffect(() => {
//         isGameWon ? setRun(true) : setRun(false);
//     }, [isGameWon]);

//     return <Confetti run={run} width={width} height={height} />;
// };

// export default ConfettiWrapper;
