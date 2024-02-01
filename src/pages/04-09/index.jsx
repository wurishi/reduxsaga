import { Provider } from 'react-redux';
import store from './main';

export default function () {
  function action(type, payload) {
    const a = store.dispatch({ type, payload });
  }
  return (
    <Provider store={store}>
      <button onClick={() => action('START_EVERY_TASK')}>
        START_EVERY_TASK
      </button>
      <hr />
      <button onClick={() => action('one_every')}>one_every</button>
      <button onClick={() => action('two_every')}>two_every</button>
      <hr />
      <button onClick={() => action('START_LATEST_TASK')}>
        START_LATEST_TASK
      </button>
      <hr />
      <button onClick={() => action('three_latest')}>three_latest</button>
      <button onClick={() => action('four_latest')}>four_latest</button>
    </Provider>
  );
}
