import styled from 'styled-components';

export const StyledStartButton = styled.button`
    display: flex;

    justify-content: center;

    width: min-content;
    padding: 0 15px;
    font-size: 2vmin;
    border-radius: 0 15px 15px 0;
    border-width: 3px 3px 3px 0;
    border-style: solid;
    border-color: white;

    outline: none;
    cursor: pointer;

    background-color: black;
    color: white;

    :hover {
        opacity: 0.8;
    }
`;
