import { combineReducers } from 'redux';

const defaultState = {
  color: 'white',
};

const ACTIONS_HANDLER = {};

function reducer(state = defaultState, action) {
  const handler = ACTIONS_HANDLER[action.type];
  return handler ? handler(state, action) : state;
}

export default combineReducers({
  '04-12': reducer,
});
