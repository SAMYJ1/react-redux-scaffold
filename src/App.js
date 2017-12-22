import React, { Component } from 'react';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import createSagaMiddleware from 'redux-saga'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom'
import { routerReducer as routing } from 'react-router-redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import promiseMiddleware from './utils/promiseMiddleware'
import reducers from './reducers'
import sagaManager from './sagas'


import Home from './pages/App'
import './App.less';


const sagaMiddleware = createSagaMiddleware();

let middlewares = [promiseMiddleware, sagaMiddleware];
if (process.env.NODE_ENV === 'development'){
  middlewares.push(logger)
} else {
  require('babel-polyfill')
}

const enhancer = compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const initialState = {};


const store = createStore(combineReducers({...reducers, routing }), initialState, enhancer);

// run sagas
sagaManager.startSagas(sagaMiddleware);

if (module.hot){
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers');
    const combinedReducers = combineReducers({ ...nextRootReducer, routing });

    store.replaceReducer(combinedReducers);
  });
  module.hot.accept('./sagas', () => {
    sagaManager.cancelSagas(store);
    require('./sagas').default.startSagas(sagaMiddleware)
  });
}





class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router forceRefresh={!('pushState' in window.history)}>
          <Switch>
            <Route path="/" component={Home} />
            <Route render={()=> <h2>404</h2>} />
          </Switch>

        </Router>

      </Provider>

    );
  }
}

export default App;
