import { Provider } from 'react-redux';
import store from './main';

export default function () {
  function action(type, payload) {
    store.dispatch({ type, payload });
  }

  function throttling() {
    action('01_WATCH', {
      dom: document.body,
    });
  }

  return (
    <Provider store={store}>
      <button onMouseDown={throttling}>throttling</button>
      <hr />
      <button onMouseDown={() => action('02_INPUT', { time: Date.now() })}>
        debouncing
      </button>
      <hr />
    </Provider>
  );
}
