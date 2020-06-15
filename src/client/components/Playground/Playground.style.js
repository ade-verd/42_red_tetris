import styled from 'styled-components';

export const StyledPlaygroundWrapper = styled.div`
    flex: 3 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    border: 2px solid #555559;
    margin: inherit;
`;

export const StyledPlayground = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    align-items: center;
    align-content: center;
    margin: 0 auto;
    border: 2px solid #555559;
    height: 100%;
    min-height: 0;

    aside {
        width: 100%;
        max-width: 200px;
        display: block;
        padding: 0 20px;
    }
`;
