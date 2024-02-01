import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './main';

export default function () {
  const [isLogin, setIsLogin] = useState(store.getState()['04-02'].isLogin);

  useEffect(() => {
    const un = store.subscribe(() => {
      setIsLogin(store.getState()['04-02'].isLogin);
    });
    return () => {
      un();
    };
  }, []);

  function clickLogin() {
    store.dispatch({
      type: 'LOGIN_REQUEST',
      user: 'username',
      password: '123456',
    });
  }

  function clickLogout() {
    store.dispatch({ type: 'LOGOUT' });
  }

  return (
    <Provider store={store}>
      <div>是否登录: {isLogin ? 'yes' : 'no'}</div>
      <button onClick={clickLogin}>点击登录</button>
      <br />
      <button onClick={clickLogout}>退出登录</button>
    </Provider>
  );
}
