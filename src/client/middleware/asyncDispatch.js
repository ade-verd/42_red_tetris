// This middleware will just add the property "async dispatch"
// to actions with the "async" propperty set to true
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
  
    console.log('Inside middleware asyncDispatch, store.getState()', store.getState());
  
    const actionWithAsyncDispatch =
      Object.assign({}, action, { asyncDispatch, allStates: store.getState() });
  
    const res = next(actionWithAsyncDispatch);
  
    syncActivityFinished = true;
    flushQueue();
  
    return res;
};