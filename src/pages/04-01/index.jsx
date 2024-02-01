import { Provider } from 'react-redux';
import store from './main';

export default function () {
  function action(type, ...args) {
    store.dispatch({ type, payload: args });
  }

  return (
    <Provider store={store}>
      <button onClick={() => action('Action 1')}>Action 1</button>
      <br />
      <button onClick={() => action('Action 2', 'Hello')}>Action 2</button>
      <br />
      <button onClick={() => action('Action 3', 1, 2, 3)}>Action 3</button>
      <br />
    </Provider>
  );
}
