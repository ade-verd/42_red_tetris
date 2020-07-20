import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { logOut } from '../../../../actions/players/logOut';

import { store } from '../../../../store/store';

import css from './Logout.module.css';

function MyVerticallyCenteredModal(props) {
    return (
        <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Log out</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Really ?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={() => {
                        logOut(store.dispatch);
                        props.onHide();
                    }}
                >
                    Log out
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

const Logout = ({ user }) => {
    if (!user || !user.id) return null;

    fontAwesomeLibrary.add(faSignOutAlt);

    const [modalShow, setModalShow] = useState(false);

    return (
        <div className={css['username-container']}>
            <span className={css.username}>{user.name}</span>
            <span className={css.logout}>
                <FontAwesomeIcon
                    icon={['fas', 'sign-out-alt']}
                    title="Log out"
                    onClick={() => setModalShow(true)}
                />
                <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />
            </span>
        </div>
    );
};

export default Logout;
