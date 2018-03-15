const promiseMiddleware = (store)=> (next) => (action) => {

  const {type, types, promise, ...rest} = action;
  // console.log('action middleware ->', action);

  if (!promise){
    return next(action)
  }

  if (type){
    return promise.then(result => {
      if (result){
        return next({type, result, ...rest})
      } else {
        return next({type, error: 'no data returns', ...rest})
      }
    })
  }

  if (types){
    let [REQUEST, SUCCESS, ERROR] = types;
    next({type: REQUEST, ...rest});
    return promise.then(result => {
      if (!result){
        return next({type: ERROR, error: 'no data returns', ...rest,})
      }
      if (result.error){
        return next({type: ERROR, error: result.error, ...rest})
      }
      return next({type: SUCCESS, result, ...rest})

    }, error => {
      next({type: ERROR, error, ...rest})
    })
  }
};

export default promiseMiddleware