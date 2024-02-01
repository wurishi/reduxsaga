import { combineReducers } from 'redux';

const defaultState = {
  user: null,
};

const ACTIONS_HANDLER = {
  USER_FETCH_SUCCESS(state = defaultState, action) {
    return { ...state, user: action.user };
  },
  USER_FETCH_FAILED(state = defaultState, action) {
    return { ...state, user: null };
  },
};

function reducer(state = defaultState, action) {
  const handler = ACTIONS_HANDLER[action.type];
  return handler ? handler(state, action) : state;
}

export default combineReducers({
  '01-01': reducer,
});
