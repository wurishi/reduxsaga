import { combineReducers } from 'redux';

const defaultState = {
};

const ACTIONS_HANDLER = {};

function reducer(state = defaultState, action) {
  const handler = ACTIONS_HANDLER[action.type];
  return handler ? handler(state, action) : state;
}

export default combineReducers({
  '05': reducer,
});
