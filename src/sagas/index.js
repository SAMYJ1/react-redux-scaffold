import { fork, take, cancel } from 'redux-saga/effects';

// Use require.context to require sagas automatically
// Ref: https://webpack.github.io/docs/context.html
const context = require.context('./', false, /\.js$/);
const keys = context.keys().filter(item => item !== './index.js');

function* root() {
  for (let key of keys) {
    console.log(context(key))
    for (let item of Object.values(context(key))){
      yield fork(item)
    }
  }
}


const CANCEL_SAGAS_HMR = 'CANCEL_SAGAS_HMR';

function createAbortableSaga (saga) {
  if (process.env.NODE_ENV === 'development') {
    return function* main () {
      const sagaTask = yield fork(saga);
      yield take(CANCEL_SAGAS_HMR);
      yield cancel(sagaTask);
    };
  } else {
    return saga;
  }
}

const SagaManager = {
  startSagas(sagaMiddleware) {
    sagaMiddleware.run(createAbortableSaga(root))
  },
  cancelSagas(store) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR
    });
  }
};

export default SagaManager;
