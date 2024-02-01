import { combineReducers } from 'redux';

const defaultState = {
  start: false,
  score: 0,
};

const ACTIONS_HANDLER = {
  GAME_START(state) {
    return { ...state, start: true };
  },
  GAME_RESTART(state) {
    return { ...state, start: false };
  },
  SHOW_SCORE(state, action) {
    return { ...state, score: action.score };
  },
};

function reducer(state = defaultState, action) {
  const handler = ACTIONS_HANDLER[action.type];
  return handler ? handler(state, action) : state;
}

export default combineReducers({
  '04-06': reducer,
});
