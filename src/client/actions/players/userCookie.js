import Cookies from 'universal-cookie';

import { ACTIONS } from '../../middleware/handleSocket';

const _getUserInfo = (userState, player) => {
    let userInfo;
    if (player) {
        userInfo = { ...player };
    } else {
        userInfo = { _id: userState.id, name: userState.name };
    }
    userInfo.socketId = userState.socketId;
    return userInfo;
};

export const setUserCookie = (userState, player, error) => {
    console.log('[setCookie]', userState);
    if (userState.isUserCookieEnable !== true && !getUserCookie()) return;
    if (error) return;

    const { _id, name, socketId } = _getUserInfo(userState, player);
    if (_id && name) {
        removeUserCookie();
        const cookie = new Cookies();

        let date = new Date();
        date.setTime(date.getTime() + 60 * 60 * 1000); // 60 minutes

        const content = JSON.stringify({ _id, name, socketId });
        cookie.set('user', content, { path: '/', expires: date });
        console.debug('[setCookie]', content);
    }
};

export const getUserCookie = () => {
    const cookie = new Cookies();
    const content = cookie.get('user', { doNotParse: true });
    const userCookie = content && JSON.parse(content);

    console.debug('[getCookie]', userCookie);
    return userCookie || null;
};

export const removeUserCookie = () => {
    const cookie = new Cookies();
    cookie.remove('user', { path: '/' });
    console.debug('[removeCookie]', 'removed');
};

export const setUserCookieSettings = (dispatch, isUserCookieEnable) => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'USER_COOKIE_SETTINGS',
        isUserCookieEnable,
    });
};
