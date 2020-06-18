// This middleware will just add the property "allStates" to all the actions
// so you can access any state in any reducer
export const allStatesMiddleware = store => next => action => {
  
    const actionWithAllStates =
      Object.assign({}, action, { allStates: store.getState() });
  
    const res = next(actionWithAllStates);
  
    return res;
};