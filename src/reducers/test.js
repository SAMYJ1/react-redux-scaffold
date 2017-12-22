import { createReducer } from '../utils/createReducer'

const namespace = 'test';

const initialState = {
  loading: true
};


const reducers = {
  reduceFoo(state = initialState, action){
    console.log('test reducers ->', )
  }

};

export default createReducer(initialState, reducers, namespace)


export function foo(action) {
  return {
    type: 'test/reduceFoo',
    promise: new Promise((resolve, reject)=> resolve('success')),
    action

  }
}

export function bar() {
  return {
    type: 'TEST_TAKE_SAGA',

  }
}