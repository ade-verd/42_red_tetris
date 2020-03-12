import Cookies from 'universal-cookie';

import { ACTIONS } from '../../middleware/handleSocket';

export const setUserCookie = (userState, player, error) => {
    if (userState.isUserCookieEnable !== true) return;
    if (error) return;

    const { _id, name } = player;
    if (_id && name) {
        const cookie = new Cookies();

        let date = new Date();
        date.setTime(date.getTime() + 60 * 60 * 1000); // 60 minutes

        const content = JSON.stringify({ _id, name });
        cookie.set('user', content, { path: '/', expires: date });
        console.debug('[setCookie]', content);
    }
};

export const getUserCookie = () => {
    const cookie = new Cookies();
    const content = cookie.get('user', { doNotParse: true });
    const player = content && JSON.parse(content);

    console.debug('[getCookie]', player);
    return player || null;
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
