const { put, take } = require('redux-saga/effects');
const {
  doStuffThenChangeColor,
  doStuff,
  CHOOSE_NUMBER,
  chooseNumber,
} = require('./saga2');
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { changeUI } from './saga1';

test('test doStuffThenChangeColor', () => {
  const gen = cloneableGenerator(doStuffThenChangeColor)();
  expect(gen.next().value).toEqual(put(doStuff()));
  expect(gen.next().value).toEqual(put(doStuff()));
  expect(gen.next().value).toEqual(take(CHOOSE_NUMBER));
  let clone = gen.clone();
  expect(clone.next(chooseNumber(0)).value).toEqual(put(changeUI('red')));
  clone = gen.clone();
  expect(clone.next(chooseNumber(1)).value).toEqual(put(changeUI('blue')));
});
