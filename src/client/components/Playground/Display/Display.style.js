import styled from 'styled-components';

export const StyledTitle = styled.div`
    display: flex;

    width: min-content;
    font-size: 3vmin;
    margin-top: 10px;
    margin-${props => (props.title === 'NEXT' ? 'right' : 'left')}: auto;
    border-radius: ${props => (props.title === 'NEXT' ? '0 15px 15px 0' : '15px 0 0 15px')};
    padding: 0 ${props => (props.title === 'NEXT' ? '20%' : '15px')};

    background-color: white;
    color: black;
`;

export const StyledDisplay = styled.div`
    display: flex;

    width: min-content;
    font-size: 3vmin;
    ${props => (props.title === 'NEXT' || props.gameOver
        ? 'margin: auto'
        : 'margin-left: auto'
    )};
    padding: ${props => (props.title === 'NEXT'
        ? '20% 5% 0 0'
        : '10px'
    )};
    ${props => (props.gameOver ? 'padding-bottom: 20px' : '')};

    color: ${props => (props.gameOver ? '#cc0000' : 'white')};
`;
