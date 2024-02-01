import { delay, put, takeEvery, cps } from 'redux-saga/effects';

import {
  incrementAsync,
  helloSaga,
  watchIncrementAsync,
  fetchProducts,
  watchFetchProducts,
} from './sagas';
import rootSaga from './sagas';

test('test', () => {
  expect(1).toEqual(1);
});

test('incrementAsync Saga test', () => {
  const gen = incrementAsync();

  expect(gen.next().value).toEqual(delay(1000));
  expect(gen.next().value).toEqual(put({ type: 'INCREMENT' }));
  expect(gen.next()).toEqual({ done: true, value: undefined });
});

test('helloSaga test', () => {
  const gen = helloSaga();
  expect(gen.next().done).toEqual(true);
});

test('watchIncrementAsync', () => {
  const gen = watchIncrementAsync();

  const takeEveryValue = gen.next().value;
  expect(takeEveryValue.payload.args[0]).toEqual('INCREMENT_ASYNC');
  expect(takeEveryValue.payload.args[1]).toEqual(incrementAsync);

  expect(gen.next().done).toEqual(true);
});

test('rootSaga', () => {
  const gen = rootSaga();
  const allValue = gen.next().value;
  expect(allValue.type).toEqual('ALL');
});

// test('fetchProducts', () => {
//   const gen = fetchProducts();
//   expect(gen.next()).toEqual('1');
// });
