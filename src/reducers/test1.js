import { createReducer } from '../utils/createReducer'



const initialState = {
  loading: true
};


const reducers = {
  reducerFoo(state = initialState, action){
    console.log('test1 reducers ->', )
  }

};

export default createReducer(initialState, reducers)


export function foo(action) {
  return {
    type: 'reducerFoo',

    action

  }
}

export function bar() {
  return {
    type: 'BAR',

  }
}