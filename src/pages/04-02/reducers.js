import { combineReducers } from 'redux';

const defaultState = {
  token: '',
  isLogin: false,
};

const ACTIONS_HANDLER = {
  LOGOUT(state) {
    return { ...state, isLogin: false };
  },
  LOGIN_SUCCESS(state, action) {
    // 在 newLoginFlow 中, token 仅能在 authorize 中处理
    // 所以在 authorize 中派发的 LOGIN_SUCCESS 需要额外保存 token
    return { ...state, isLogin: true, token: action.token };
  },
  STORE_TOKEN(state, action) {
    return { ...state, token: action.token };
  },
  CLEAR_TOKEN(state) {
    return { ...state, token: '' };
  },
};

function reducer(state = defaultState, action) {
  const handler = ACTIONS_HANDLER[action.type];
  return handler ? handler(state, action) : state;
}

export default combineReducers({
  '04-02': reducer,
});
