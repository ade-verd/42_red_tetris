import React from 'react';

import StyledRoom from '../styles/StyledRoom';

import { MAX_PLAYERS } from '../../../../constants';

const Room = props => {
    return (
        <StyledRoom>
            <div>{props.name}</div>
            <div>
                {props.playersNumber} / {MAX_PLAYERS}
            </div>
            <div>{props.status}</div>
            {props.children}
        </StyledRoom>
    );
};

export default React.memo(Room);
