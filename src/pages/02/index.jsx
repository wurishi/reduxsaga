import { Provider } from 'react-redux';
import store from './main';
import Counter from './counter';
import { useEffect, useState } from 'react';

export default function () {
  const [count, setCount] = useState(store.getState()['02'].count);
  const [num, setNum] = useState(20);
  useEffect(() => {
    const un = store.subscribe(() => {
      setCount(store.getState()['02'].count);
    });
    return () => {
      un();
    };
  }, []);
  function action(type) {
    store.dispatch({ type });
  }
  function numAction(num) {
    store.dispatch({ type: 'RANDOM_NUM_ASYNC', num });
  }
  return (
    <Provider store={store}>
      <Counter
        value={count}
        onIncrement={() => action('INCREMENT')}
        onDecrement={() => action('DECREMENT')}
        onIncrementAsync={() => action('INCREMENT_ASYNC')}
        onRandom={() => {
          const newNum = Math.floor(Math.random() * 100);
          numAction(newNum);
          setNum(newNum);
        }}
      />
      {num}
    </Provider>
  );
}
