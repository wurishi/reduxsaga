import { Provider } from 'react-redux';
import store from './main';
import { END } from 'redux-saga';

export default function () {
  function action(type, payload) {
    store.dispatch({ type, payload });
  }

  function takeToString() {
    // const action = { type: 'TAKE_TOSTRING', payload: { TMP: 'TMP' } };
    // action.__proto__.toString = function () {
    //   return 'TAKE_3';
    // };
    // store.dispatch(action);
    store.dispatch({ type: 'TAKE_3' });
  }

  return (
    <Provider store={store}>
      <button onMouseDown={() => action('TAKE_LEADING', { time: Date.now() })}>
        TAKE_LEADING
      </button>
      <hr />
      <button onMouseDown={() => action('TAKE_2', { TMP: 'TMP' })}>
        TAKE_2
      </button>
      <button onMouseDown={takeToString}>TAKE_toString</button>
      <hr />
      <button onMouseDown={() => action('3_TAKE', { time: Date.now() })}>
        3_TAKE
      </button>
      <button onMouseDown={() => store.dispatch(END)}>3_TAKE_END</button>
      <hr />
      <button onMouseDown={() => action('FORK_TASK', { time: Date.now() })}>
        FORK_TASK
      </button>
    </Provider>
  );
}
