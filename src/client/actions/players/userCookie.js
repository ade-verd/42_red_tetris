import Cookies from 'universal-cookie';

import config from '../../config';

export const setUserCookie = (player, error) => {
    if (config.cookies.user.isEnable === false) return;
    if (error) return;

    const { _id, name } = player;
    if (_id && name) {
        const cookie = new Cookies();

        let date = new Date();
        date.setTime(date.getTime() + 10 * 60 * 1000); // 10 minutes

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
