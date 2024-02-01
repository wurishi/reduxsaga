import { Provider } from 'react-redux';
import store from './main';

export default function () {
  function action(type) {
    store.dispatch({ type });
  }
  return (
    <Provider store={store}>
      <h2>04-08</h2>
      <button onClick={() => action('ATTACHED_START')}>ATTACHED_START</button>
      <br />
      <button onClick={() => action('ATTACHED_START_1')}>
        ATTACHED_START_1
      </button>
      <br />
      <button onClick={() => action('ATTACHED_START_2')}>
        ATTACHED_START_2
      </button>
      <button onClick={() => action('ATTACHED_START_2_END')}>
        ATTACHED_START_2_END
      </button>
      <br />
      <button onClick={() => action('DETACHED')}>DETACHED</button>
      <br />
    </Provider>
  );
}
