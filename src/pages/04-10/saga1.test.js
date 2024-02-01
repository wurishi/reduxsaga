import { put, take } from 'redux-saga/effects';
import {
  CHOOSE_COLOR, //
  changeColorSaga,
  chooseColor,
  changeUI,
} from './saga1';

test('test changeColorSaga', () => {
  const gen = changeColorSaga();
  expect(gen.next().value).toEqual(take(CHOOSE_COLOR));

  const color = 'red';
  expect(gen.next(chooseColor(color)).value) //
    .toEqual(put(changeUI(color)));

  expect(gen.next().done).toEqual(true);
});
