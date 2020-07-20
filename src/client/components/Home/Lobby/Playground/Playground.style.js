import styled from 'styled-components';

export const StyledPlayground = styled.div`
    flex: 3;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* height: 100%; */
    /* min-height: 0; */

    border: 2px solid #555559;
    border-radius: 5px;
    background-color: rgba(30, 30, 35, 0.9);
    margin: inherit;

    justify-content: center;
    align-items: center;
    align-content: center;

    :focus {
        outline: none;
    }
`;
