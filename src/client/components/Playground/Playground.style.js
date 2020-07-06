import styled from 'styled-components';

export const StyledPlayground = styled.div`
    flex: 3;
    display: flex;
    flex-direction: row;

    border: 2px solid #555559;
    border-radius: 5px;
    background-color: rgba(30, 30, 35, 0.9);
    margin: inherit;
    align-items: center;

    :focus {
        outline: none;
    }
`;
