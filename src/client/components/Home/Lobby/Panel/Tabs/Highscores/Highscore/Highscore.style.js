import styled from 'styled-components';
import { UserStar } from '@styled-icons/remix-fill/UserStar';
import { User } from '@styled-icons/remix-fill/User';

export const StyledHighscore = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    padding: 1em 4em;
    height: min-content;
    align-items: center;

    border-bottom: 2px solid #555559;

    svg {
        width: 3em;
    }
`;

export const StyledName = styled.div`
    display: flex;
    flex: 1;

    height: min-content;

    color: #fff;
    text-shadow: #fff;
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
