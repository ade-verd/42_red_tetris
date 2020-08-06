import React, { useState, useEffect } from 'react';

import Command from './Command/Command';
import css from './Commands.module.css';

import gameSettings from '../../../../../../../config/gameSettings';

const buildCommands = () =>
    gameSettings.commands.map(({ action, code, key }, i) => {
        return <Command key={i} action={action} code={code} touchKey={key} />;
    });

const Commands = ({ gameStatus }) => {
    if (gameStatus.playing) return null;
    return <div className={css.container}> {buildCommands()} </div>;
};

export default React.memo(Commands);
