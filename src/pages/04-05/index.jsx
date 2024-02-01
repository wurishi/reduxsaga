import { Provider } from 'react-redux';
import store from './main';

export default function () {
  return (
    <Provider store={store}>
      <button onClick={() => store.dispatch({ type: 'GAME' })}>GAME</button>
    </Provider>
  );
}
