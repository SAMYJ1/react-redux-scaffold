import { fork, take, cancel } from 'redux-saga/effects';


// Use require.context to require sagas automatically
// Ref: https://webpack.github.io/docs/context.html
const context = require.context('./', false, /\.ts$/);
const keys = context.keys().filter((item: string) => item !== './index.ts');

function* root() {
  for (let key of keys) {
    for (let item of Object.values(context(key))){
      yield fork(<any>item)
    }
  }
}


const CANCEL_SAGAS_HMR = 'CANCEL_SAGAS_HMR';

function createAbortableSaga (saga: any) {
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
  startSagas(sagaMiddleware: any) {
    sagaMiddleware.run(createAbortableSaga(root))
  },
  cancelSagas(store: any) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR
    });
  }
};

export default SagaManager;
