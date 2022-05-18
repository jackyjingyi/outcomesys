import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter as Router} from "react-router-dom";
import {createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {Provider} from 'react-redux'
import App from './App';
import counter from './reducers'

const middleware = [thunk]
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
}
const store = createStore(counter, applyMiddleware(...middleware))
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Provider store={store}>
            <App/>
        </Provider>
    </Router>
);

