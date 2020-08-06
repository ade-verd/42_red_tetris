import React, { useState, useEffect } from 'react';

import { StyledWrapper, StyledSpectrum, Row } from './Spectrum.style';
import Cell from './Cell/Cell';
import FieldMask from '../../FieldWrapper/Field/FieldMask/FieldMask';

import { setSpectrum } from '../../../../../../actions/game/spectrum';

import { store } from '../../../../../../store/store';

import { FIELD_HEIGHT, FIELD_WIDTH } from '../../../../../../../constants/';

const buildEmptySpectrum = () =>
    Array.from(Array(FIELD_HEIGHT), () => new Array(FIELD_WIDTH).fill('clear'));

const buildEmptySpectrumData = (players, playerId) => {
    const payload = {
        player_id: playerId,
        player_name: players[playerId],
        spectrum: buildEmptySpectrum(),
    };
    setSpectrum(store.dispatch, payload);
    return { playerId, playerName: players[playerId], spectrum: payload.spectrum };
};

const buildSpectrum = spectrum => {
    return spectrum.map((row, y) => (
        <Row key={y}>
            {row.map((cell, x) => (
                <Cell key={x} status={cell} />
            ))}
        </Row>
    ));
};

const Spectrum = ({ players, spectrums, playerId }) => {
    const [spectrumData, setSpectrumData] = useState();
    const [gameStatus, setGameStatus] = useState();

    useEffect(() => {
        if (spectrums[playerId]) {
            setSpectrumData(spectrums[playerId]);
        } else if (players[playerId]) {
            setSpectrumData(buildEmptySpectrumData(players, playerId));
        }
    }, [spectrums[playerId], players[playerId]]);

    useEffect(() => {
        if (spectrums && spectrums[playerId]) {
            if (spectrums[playerId].isGameWon) {
                setGameStatus('Winner');
            } else if (spectrums[playerId].isGameOver) {
                setGameStatus('Game over');
            } else {
                setGameStatus('');
            }
        }
    }, [spectrumData]);

    return spectrumData ? (
        <StyledWrapper>
            <StyledSpectrum>
                <FieldMask
                    isSpectrum={true}
                    isGameOver={spectrumData.isGameOver || spectrumData.isGameWon}
                    content={gameStatus}
                />
                {buildSpectrum(spectrumData.spectrum)}
            </StyledSpectrum>
            {spectrumData.playerName}
        </StyledWrapper>
    ) : null;
};

export default React.memo(Spectrum);
