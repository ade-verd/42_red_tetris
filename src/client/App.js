import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Playground from './containers/Playground';
import Rooms from './containers/Rooms';
import Home from './containers/Home';

import { configureNotificationContainer } from './actions/Notification';

// const playing = 1

// const renderSwitch = () => {
// 	switch(playing) {
// 		case 1:
// 			return <Playground playing={playing}/>
// 		case 2:
// 			return <Rooms playing={playing}/>
// 		case 0:
// 		default:
// 			return (
// 				<div>
// 					<label for="name">Name</label>
// 					<input type="text" id="name" name="name" required />
// 				</div>
// 			)
// 	}
// }

configureNotificationContainer();

const App = () => (
    <div className="App">
        <Switch>
            <Route path="/playground" component={Playground} />
            <Route path="/rooms" component={Rooms} />
            <Route path="/" exact component={Home} />
        </Switch>
    </div>
);

export default App;
