import styled from 'styled-components';
import { UserStar } from '@styled-icons/remix-fill/UserStar';
import { User } from '@styled-icons/remix-fill/User';

export const StyledEmpty = styled.div`
    flex: 1;
    display: flex;
    align-self: center;
    align-items: center;
`;

export const StyledHighscore = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;

    margin: 0 0.5em;
    padding: 0.5em 0;

    color: #fff;
    /* text-shadow: #fff; */

    :not(:last-child) {
        border-bottom: 2px solid #555559;
    }

    svg {
        width: 3em;
    }
`;

export const StyledName = styled.div`
    display: flex;
    flex: 1;
    margin-right: 1em;
`;

export const StyledScore = styled.div`
    margin-right: 0.5em;
`;

export const StyledText = styled.div`
    align-self: flex-start;
    font-size: 0.66em;
    padding-right: 0.5em;
`;

export const FirstPlayerIcon = styled(UserStar)`
    font-size: 1.25vmin;
    color: #009df3;
    margin-right: 1em;
`;

export const PlayerIcon = styled(User)`
    font-size: 1.25vmin;
    color: #009df3;
    margin-right: 1em;
`;
