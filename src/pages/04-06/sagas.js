const { call, put, all, take, race, delay } = require('redux-saga/effects');

function mock(time) {
  return new Promise((r) => {
    setTimeout(() => r(time + Math.random()), time);
  });
}

function* task1() {
  return yield call(mock, 100);
}

function* task2() {
  return yield call(mock, 200);
}

function* mainTask() {
  yield take('MAIN');
  const scores = yield all([call(task1), call(task2), call(task1)]);
  yield put({ type: 'SCORES', scores });
}

function* game() {
  let finished = false;
  while (!finished) {
    yield take('GAME_START');

    const { score, timeout } = yield race({
      score: call(play),
      timeout: delay(5000),
    });

    if (!timeout) {
      finished = true;
      yield put({ type: 'GAME_STOP' });
      yield put({ type: 'SHOW_SCORE', score });
    } else {
      yield put({ type: 'GAME_RESTART' });
    }
  }
}

function* play() {
  let score = 0;
  let key = '';
  window.addEventListener('keypress', (evt) => {
    key = evt.key;
    score++;
  });
  while (key !== 'e') {
    yield delay(10);
  }
  return score;
}

export default function* () {
  yield all([
    mainTask(), //
    game(),
  ]);
}
