import {take, fork, put} from 'redux-saga/effects'

export function* testSaga(){
  while (true){
    yield take('TEST_TAKE_SAGA');
    yield put({type: 'reducerFoo', action: {foo: 1, bar: 2}})
  }
}