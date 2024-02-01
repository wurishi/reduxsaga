import { useState } from 'react';
import { Provider } from 'react-redux';
import store from './main';

export default function () {
  const [time, setTime] = useState(0);
  function clickFn() {
    const t = Math.floor(Math.random() * 2000);
    setTime(t);
    store.dispatch({ type: '04-04', time: t });
  }
  return (
    <Provider store={store}>
      <div>耗时: {time}</div>
      <button onClick={clickFn}>点击开始 04-04</button>
      <button onClick={() => store.dispatch({ type: 'START_BACKGROUND_TASK' })}>
        Start Background Task
      </button>
      <button onClick={() => store.dispatch({ type: 'CANCEL_TASK' })}>
        Stop Background Task
      </button>
    </Provider>
  );
}
