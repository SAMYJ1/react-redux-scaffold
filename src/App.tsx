import * as React from 'react';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import createSagaMiddleware from 'redux-saga'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { routerReducer as routing } from 'react-router-redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import promiseMiddleware from './utils/promiseMiddleware'
import reducers from './reducers/index'
import sagaManager from './sagas/index'

import Home from './pages/App/index'

type SsoCfg = { appid: string, endPoint: string}
declare global {
    namespace NodeJS {
        interface Global {
            host: string;
            ssoCfg: SsoCfg
        }
    }
    interface NodeModule {
        readonly hot: any
    }
    interface Window {
        readonly devToolsExtension: any
    }
    interface NodeRequire {
        readonly context: any
    }

}



/* global location */
/* eslint no-restricted-globals: ["off", "location"] */


const sagaMiddleware = createSagaMiddleware();

let middleware: any[] = [promiseMiddleware, sagaMiddleware];
if (process.env.NODE_ENV === 'development'){
    middleware.push(logger)
} else {
    require('babel-polyfill')
}

const enhancer = compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : (f: any) => f
);

const initialState: object = {};


const store = createStore(combineReducers({...reducers, routing }), initialState, enhancer);

// run sagas
sagaManager.startSagas(sagaMiddleware);

if (module.hot){
    module.hot.accept('./reducers', () => {
        const nextRootReducer = require('./reducers/index');
        const combinedReducers = combineReducers({ ...nextRootReducer, routing });

        store.replaceReducer(combinedReducers);
    });
    module.hot.accept('./sagas', () => {
        sagaManager.cancelSagas(store);
        require('./sagas/index').default.startSagas(sagaMiddleware)
    });
}



class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Router forceRefresh={!('pushState' in window.history)}>
                    <Switch>
                        <Route path="/" component={Home} />
                        <Redirect from="/*" to="/"/>
                        <Route render={()=> <h2>404</h2>} />
                    </Switch>

                </Router>

            </Provider>

        );
    }
}

export default App;
