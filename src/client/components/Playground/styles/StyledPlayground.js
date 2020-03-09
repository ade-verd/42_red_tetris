import styled from 'styled-components';

export const StyledPlaygroundWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`;

export const StyledPlayground = styled.div`
    display: flex;
    align-items: flex-start;
    padding: 40px;
    margin: 0 auto;

    aside {
        width: 100%;
        max-width: 200px;
        display: block;
        padding: 0 20px;
    }
`;
