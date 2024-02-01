import { Provider } from 'react-redux';
import store from './main';

export default function () {
  function action(type) {
    store.dispatch({ type });
  }

  function CR() {
    store.dispatch({
      type: 'CHANNEL_REQUEST',
      payload: {
        num: Math.random(),
        time: Math.floor(Math.random() * 3000),
      },
    });
  }

  return (
    <Provider store={store}>
      <button onClick={() => action('REQUEST')}>REQUEST</button>
      <br />
      <button onClick={() => action('SECOND_START')}>SECOND_START</button>
      <br />
      <button onClick={CR}>CHANNEL_REQUEST</button>
    </Provider>
  );
}
