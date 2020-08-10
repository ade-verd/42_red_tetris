'use strict';

import { emitCreatePlayerAndRoom } from './createPlayerAndRoom';

export const parseHash = hash => {
    const regexp = /^\#([\w-_ ]+)\[([\w-_ ]+)\]$/;
    const matches = regexp.exec(hash);

    return {
        room: matches && matches[1],
        player: matches && matches[2],
    };
};

export const handleHashRoute = (store, hash) => {
    const userState = store.getState().usr;
    if (userState.roomId) return;

    const names = parseHash(hash);
    if (names.player && names.room) {
        emitCreatePlayerAndRoom(store.dispatch, names.player, names.room);
    }
};
