type Action = {
    readonly type?: string,
    readonly types?: string[],
    [propName: string]: any
}

const promiseMiddleware = ()=> (next: any) => (action: Action) => {

  const {type, types, promise, ...rest} = action;
  // console.log('action middleware ->', action);

  if (!promise){
    return next(action)
  }

  if (type){
    return promise.then((result: any) => {
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
    return promise.then((result: any) => {
      if (!result){
        return next({type: ERROR, error: 'no data returns', ...rest,})
      }
      if (result.error){
        return next({type: ERROR, error: result.error, ...rest})
      }
      // console.log('promise middleware->', result)
      return next({type: SUCCESS, result, ...rest})

    }, (error: any) => {
      next({type: ERROR, error, ...rest})
    })
  }
};

export default promiseMiddleware