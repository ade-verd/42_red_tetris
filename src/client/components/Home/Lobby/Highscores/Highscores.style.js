import styled from 'styled-components';

export const StyledHighscores = styled.div`
    display: flex;
    flex: 1 0;
    flex-direction: column;

    height: 100%;
    min-height: 0;
    margin: inherit;

    border-radius: 5px;
    border: 2px solid #555559;
    
    background-color: #1e1e23;
    color: #fff;
    opacity: 0.9;
`;

export const StyledLabel = styled.div`
    text-align: center;
    padding: 0.375rem 0.75rem;

    border: 1px solid transparent;
    border-radius: 5px 5px 0 0 !important;

    background-color: #fff !important;
    color: #555559 !important;
`;
