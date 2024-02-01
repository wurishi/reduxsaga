import { Provider, connect } from 'react-redux';
import store from './main';
import { useEffect, useState } from 'react';

export default function (props) {
  const [count, setCount] = useState(0);
  function onSomeButtonClicked() {
    store.dispatch({
      type: 'USER_FETCH_REQUESTED',
      payload: { userId: 'abc' },
    });
    setCount(count + 1);
  }

  useEffect(() => {
    window.document.title = '01-01: 示例' + Date.now();
  });

  return (
    <Provider store={store}>
      <h2>01-01</h2>
      <button onClick={onSomeButtonClicked}>USER_FETCH {count}</button>
    </Provider>
  );
}
