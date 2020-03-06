import { connect } from 'react-redux';

import Home from '../components/Home/Home';

import { emitCreatePlayer, onPlayerCreated } from '../actions/players/createPlayer';

const mapStateToProps = state => {
    console.debug('[Home][mapStateToProps] State', state);
    return { players: state.play.players, user: state.usr };
};

const mapDispatchToProps = dispatch => {
    return {
        emitCreatePlayer,
        listen: () => {
            onPlayerCreated(dispatch);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
