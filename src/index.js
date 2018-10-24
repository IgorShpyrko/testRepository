import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleWare from 'redux-saga'
import React from 'react';
import ReactDOM from 'react-dom';
import { composeWithDevTools } from 'redux-devtools-extension';

// import Table from './components/Table';
// import Carousel from './components/Carousel/Carousel';
import CustomElement from './components/CustomElement';
import './index.css';
import rootReducer from './reducers'
import { helloSaga } from './sagas'

const sagaMiddleware = createSagaMiddleWare()

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(helloSaga)

ReactDOM.render(
  <Provider store={store}>
    <CustomElement />
  </Provider>,
  document.getElementById('root')
);

