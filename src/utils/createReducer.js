export const createReducer = (initialState, reducers, namespace)=>{
  return (state = initialState, action ) => {
    // console.log('reducers ___>>',reducers, action)
    let type = '';
    let str = action.type.split('/');
    if (str.length > 1){
      if (str[0] !== namespace){
        return state
      }
      type = str[1];
    }else {
      type = action.type
    }



    const reducerFunc = reducers[type];
    if (!reducerFunc){
      //ignore, not to update
      return state
    }

    // update the reducer tree
    return {...state, ...reducerFunc(state, action)}
  }
};