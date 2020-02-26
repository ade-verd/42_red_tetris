export const storeStateMiddleWare = ({ getState }) => {
    return next => action => {
        let returnValue = next(action);
				window.top.state = getState();
				console.log('OOOOO', getState())
        return returnValue;
    };
};
