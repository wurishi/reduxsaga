const { call, all, put, delay, fork, take } = require('redux-saga/effects');

function mock(name, time) {
  return new Promise((r) =>
    setTimeout(() => {
      r(name + '_' + Math.floor(Math.random() * 100));
    }, time)
  );
}

function* play1() {
  return yield call(mock, 'play1', 1000);
}

function* play2() {
  return yield call(mock, 'play2', 1002);
}

function* play3() {
  return yield call(mock, 'play3', 1008);
}

function showScore(score) {
  return { type: 'SHOW_SCORE', score };
}

function* log(name) {
  yield delay(1000);
  yield put({ type: 'LOG_1000', name });
}

function* game() {
  yield take('GAME');
  yield fork(log, '1');
  const score1 = yield* play1();
  const score2 = yield* play2();
  const score3 = yield* play3();
  yield fork(log, '2');
  yield put(showScore(score1));
  yield put(showScore(score2));
  yield put(showScore(score3));
}

export default function* () {
  yield all([
    game(), //
  ]);
}
