import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './main';

export default function () {
  const [flag, setFlag] = useState(store.getState()['04-06'].start);
  const [score, setScore] = useState(store.getState()['04-06'].score);
  useEffect(() => {
    const un = store.subscribe(() => {
      setFlag(store.getState()['04-06'].start);
      setScore(store.getState()['04-06'].score);
    });
    return un;
  }, []);
  return (
    <Provider store={store}>
      {flag ? (
        <h3>{score}</h3>
      ) : (
        <button
          onClick={() => {
            store.dispatch({ type: 'GAME_START' });
          }}
        >
          Game Start
        </button>
      )}
      <br />
      <button onClick={() => store.dispatch({ type: 'MAIN' })}>MAIN</button>
    </Provider>
  );
}
