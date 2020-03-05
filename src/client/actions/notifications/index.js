import React from 'react';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export const configureNotificationContainer = () =>
    toast.configure({
        autoClose: 4000,
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
            toast.warning(msg, { autoClose: 5000 });
            break;
        case 'error':
            toast.error(msg, { autoClose: 6000 });
            break;
        default:
            toast.error(msg, { autoClose: 6000 });
    }
};

export default notify;
