import { combineReducers } from 'redux';
import { CHANGE_UI } from './saga1';

const defaultState = {
  color: 'white',
};

const ACTIONS_HANDLER = {
  [CHANGE_UI](state, action) {
    return { ...state, color: action.payload.color };
  },
};

function reducer(state = defaultState, action) {
  const handler = ACTIONS_HANDLER[action.type];
  return handler ? handler(state, action) : state;
}

export default combineReducers({
  '04-10': reducer,
});
