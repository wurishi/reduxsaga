import { combineReducers } from 'redux';

const defaultState = {
  log: [],
};

const ACTIONS_HANDLER = {
  'Action 1'(state, action) {
    return { ...state, log: state.log.concat(action) };
  },
};

function reducer(state = defaultState, action) {
  const handler = ACTIONS_HANDLER[action.type];
  return handler ? handler(state, action) : state;
}

export default combineReducers({
  '04-01': reducer,
});
