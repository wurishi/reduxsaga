import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './main';
import { chooseColor } from './saga1';
import { chooseNumber } from './saga2';

export default function () {
  const [color, setColor] = useState(store.getState()['04-10'].color);
  useEffect(() => {
    const un = store.subscribe(() => {
      setColor(store.getState()['04-10'].color);
    });
    return () => {
      un();
    };
  }, []);
  const [num, setNum] = useState(0);
  return (
    <Provider store={store}>
      <div style={{ backgroundColor: color }}>
        <button onClick={() => store.dispatch(chooseColor('red'))}>red</button>
        <button onClick={() => store.dispatch(chooseColor('green'))}>
          green
        </button>
        <button onClick={() => store.dispatch(chooseColor('yellow'))}>
          yellow
        </button>
        <hr />
        <input
          type='number'
          value={num}
          onChange={(e) => {
            setNum(e.nativeEvent.data);
          }}
        />
        <button onClick={() => store.dispatch(chooseNumber(num))}>
          send number
        </button>
        <hr />
        <button
          onClick={() => {
            store.dispatch({ type: 'CALL', url: 'http://www.baidu.com' });
          }}
        >
          CALL
        </button>
      </div>
    </Provider>
  );
}
