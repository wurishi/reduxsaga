import { put, take } from 'redux-saga/effects';
import { changeUI } from './saga1';

export const CHOOSE_NUMBER = 'CHOOSE_NUMBER';
export const DO_STUFF = 'DO_STUFF';

export const chooseNumber = (number) => ({
  type: CHOOSE_NUMBER,
  payload: {
    number,
  },
});

export const doStuff = () => ({
  type: DO_STUFF,
});

export function* doStuffThenChangeColor() {
  yield put(doStuff());
  yield put(doStuff());
  const action = yield take(CHOOSE_NUMBER);
  if (action.payload.number % 2 === 0) {
    yield put(changeUI('red'));
  } else {
    yield put(changeUI('blue'));
  }
}
