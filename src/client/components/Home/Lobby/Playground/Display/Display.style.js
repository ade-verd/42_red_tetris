import styled from 'styled-components';

export const StyledContainer = styled.div`
    flex: 1;
`;

export const StyledTitle = styled.div`
    display: flex;

    width: min-content;
    font-size: 2vmin;
    margin-top: 10px;
    margin-${props => (props.title === 'NEXT' ? 'right' : 'left')}: auto;
    border-radius: ${props => (props.title === 'NEXT' ? '0 15px 15px 0' : '15px 0 0 15px')};
    padding: 0 ${props => (props.title === 'NEXT' ? '20% 0 20%' : '15px')};

    background-color: white;
    color: black;
`;

export const StyledDisplay = styled.div`
    display: flex;

    width: min-content;
    font-size: 2vmin;
    ${props =>
        props.title === 'NEXT' || props.gameWon || props.gameOver
            ? 'margin: auto'
            : 'margin-left: auto'};
    padding: ${props => (props.title === 'NEXT' ? '20% 5% 0 0' : '10px')};
    ${props => (props.gameWon || props.gameOver ? 'padding-bottom: 20px' : '')};

    color: ${props => {
        if (props.gameWon) return '#8bc34a';
        if (props.gameOver) return '#e6443a';
        return 'white';
    }};
`;
