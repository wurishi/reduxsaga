const {
  call,
  delay,
  cancelled,
  put,
  take,
  all,
  race,
  fork,
  cancel,
} = require('redux-saga/effects');

function* task1() {
  try {
    yield call(task2);
  } finally {
    if (yield cancelled()) {
      yield put({ type: 'task1 canceled' });
    }
  }
}

export function* task2() {
  try {
    while (true) {
      console.log('task2:' + Date.now());
      yield delay(1000);
    }
  } finally {
    if (yield cancelled()) {
      yield put({ type: 'task2 canceled' });
    }
  }
}

function* task() {
  yield take('START_TASK');
  const { task, cancel } = yield race({
    task: call(task1),
    cancel: take('CANCEL_TASK'),
  });
}

export function* forkFn() {
  yield take('START_FORK');
  const task = yield fork(task2);
  yield take('CANCEL_FORK');
  yield cancel(task);
}

function* mission(name, time) {
  try {
    yield delay(time);
  } catch (error) {
  } finally {
    if (yield cancelled()) {
      console.log(name + ' finally', Date.now());
    }
  }
  console.log(name + ' 结束', Date.now());
}

function* raceTest() {
  yield take('START_TEST');
  yield race({
    mission1: call(mission, 'mission1', 1000),
    mission2: call(mission, 'mission2', 2000),
    timeout: delay(100),
  });
}

function* errFn(time) {
  yield delay(time);
  throw new Error('err:' + Date.now());
}

function* allTest() {
  yield take('START_TEST');
  yield all([
    call(mission, 'm1', 1000), //
    call(mission, 'm2', 2000),
    call(errFn, 1300),
  ]);
}

export default function* () {
  yield all([
    task(), //
    forkFn(),
    raceTest(),
    allTest(),
  ]);
}
