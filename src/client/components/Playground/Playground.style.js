import styled from 'styled-components';

export const StyledPlaygroundWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    height: 100%;
    border: 2px solid #555559;
`;

export const StyledPlayground = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    align-items: center;
    align-content: center;
    padding: 40px;
    margin: 0 auto;
    border: 2px solid #555559;
    height: 100%;

    aside {
        width: 100%;
        max-width: 200px;
        display: block;
        padding: 0 20px;
    }
`;
