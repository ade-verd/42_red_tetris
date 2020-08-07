import React, { useState, useEffect } from 'react';

import Command from './Command/Command';
import css from './Commands.module.css';

import gameSettings from '../../../../../../../config/gameSettings';

const buildCommands = () =>
    gameSettings.commands.map(({ action, key, type }, i) => {
        return <Command key={i} action={action} touchKey={key} type={type} />;
    });

const clickToStart = startText => <div className={css.begin}>{startText}</div>;

const Commands = ({ gameStatus, isAdmin }) => {
    if (gameStatus.playing) return null;

    const [startText, setStartText] = useState('');
    useEffect(() => {
        isAdmin ? setStartText('Click on Start to begin') : setStartText('Waiting for admin start');
    }, [isAdmin, gameStatus.playing]);

    return (
        <div className={css.container}>
            {buildCommands()}
            {clickToStart(startText)}
        </div>
    );
};

export default Commands;
