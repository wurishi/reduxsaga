import { Provider } from 'react-redux';
import store from './main';

export default function () {
  function action(type) {
    store.dispatch({ type });
  }
  return (
    <Provider store={store}>
      <button onClick={() => action('START_TASK')}>Start Task</button>
      <br />
      <button onClick={() => action('CANCEL_TASK')}>Cancel Task</button>
      <br />
      <button onClick={() => action('START_FORK')}>Start FORK</button>
      <br />
      <button onClick={() => action('CANCEL_FORK')}>Cancel FORK</button>
      <br />
      <button onClick={() => action('START_TEST')}>Start TEST</button>
    </Provider>
  );
}
