import {
  all,
  cancel,
  cancelled,
  delay,
  fork,
  put,
  take,
  call,
  join,
  setContext,
  getContext,
} from 'redux-saga/effects';

import { createMockTask, cloneableGenerator } from '@redux-saga/testing-utils';

import { Channel, Task, Buffer } from 'redux-saga';

function* fn1() {
  yield take('FORK_TASK');
  const task1 = yield fork(mock, 'task1');
  // const task2 = yield fork(mock, 'task2');
  const task2 = yield fork(mock2, 'task2');
  const task3 = yield fork(mock, 'task3');
  // yield delay(10);
  yield cancel(task2);
  // yield fork(mockErr);
}

function* mock2() {
  yield fork(mock, 'sub_1');
  yield fork(mock, 'sub_2');
  yield fork(mock, 'sub_3');
  yield call(mock2_fn);
}

function* mock2_fn() {
  try {
    yield put({ type: 'mock2_fn_S' });
    yield delay(5000);
    yield put({ type: 'mock2_fn_E' });
  } finally {
    if (yield cancelled()) {
      yield put({ type: 'mock2_fn_cancelled' });
    }
    yield put({ type: 'mock2_fn_finally' });
  }
}

function* mock(name) {
  // if (name === 'task3') {
  //   yield delay(10);
  //   a = 100;
  // }
  try {
    yield delay(1000);
    yield put({ type: 'FORK_TASK_' + name });
  } finally {
    if (yield cancelled()) {
      yield put({ type: 'FORK_TASK_' + name + '_FINALLY' });
    }
  }
}

function mockErr() {
  a = 100;
}

function* f2() {
  try {
    yield fork(mock, 'F2 任务');
  } finally {
    yield put({ type: 'F2 任务 finally' });
  }
}

function* joinFn() {
  try {
    yield setContext({ AAA: Date.now() });
    yield setContext({ BBB: 'BBB' });
    const task1 = yield fork(mock, 'joinFn_1');
    const task2 = yield fork(mock, 'joinFn_2');
    const task3 = yield fork(mock, 'joinFn_3');
    console.log(task2);
    yield join(task2);
  } finally {
    yield put({
      type: 'joinFn 任务 finally',
      payload: yield getContext('AAA'),
    });
  }
}

export default function* () {
  yield all([
    fn1(), //
    f2(),
    joinFn(),
  ]);
}
