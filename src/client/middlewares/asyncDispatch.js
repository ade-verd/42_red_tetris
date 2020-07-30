// This middleware will just add the property "async dispatch"
// to actions with the "async" property set to true
export const asyncDispatchMiddleware = store => next => action => {
    let syncActivityFinished = false;
    let actionQueue = [];

    function flushQueue() {
        actionQueue.forEach(a => store.dispatch(a)); // flush queue
        actionQueue = [];
    }

    function asyncDispatch(asyncAction) {
        actionQueue = actionQueue.concat([asyncAction]);

        if (syncActivityFinished) {
            flushQueue();
        }
    }

    const actionWithAsyncDispatch = Object.assign({}, action, { asyncDispatch, store });

    const res = next(actionWithAsyncDispatch);

    syncActivityFinished = true;
    flushQueue();

    return res;
};
