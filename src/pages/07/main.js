import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware({
  onError(error, errorInfo) {
    console.log(error, errorInfo);
  },
  effectMiddlewares: [
    (emit) => (action) => {
      emit(action);
    },
  ],
  sagaMonitor: {
    actionDispatched(action) {
      console.log(action);
    },
  },
});

const composeEnhancers = composeWithDevTools({
  name: '07',
});

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export default store;
