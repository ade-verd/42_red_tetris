import React from 'react';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export const configureNotificationContainer = () =>
    toast.configure({
        autoClose: 6000,
        draggable: false,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        pauseOnHover: true,
    });

const notify = ({ msg, type }) => {
    switch (type) {
        case 'info':
            toast.info(msg);
            break;
        case 'success':
            toast.success(msg);
            break;
        case 'warning':
            toast.warning(msg);
            break;
        case 'error':
            toast.error(msg);
            break;
        default:
            toast.error(msg);
    }
};

export default notify;
