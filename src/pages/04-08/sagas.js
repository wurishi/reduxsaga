import {
  all,
  call,
  cancel,
  cancelled,
  delay,
  fork,
  put,
  spawn,
  take,
} from 'redux-saga/effects';

function* fetchResource(a, d = 1000) {
  try {
    yield delay(d);
    yield put({ type: a + '_SUCCESS' });
  } catch (error) {
    yield put({ type: a + '_ERROR' });
  } finally {
    if (yield cancelled()) {
      yield put({ type: a + '_FINALLY' });
    }
  }
}

function* errorR(msg, time) {
  yield delay(time);
  throw new Error(msg);
}

function* attached() {
  yield take('ATTACHED_START');
  const task1 = yield fork(fetchResource, 'users');
  const task2 = yield fork(fetchResource, 'comments');
  yield delay(500);
  yield put({ type: 'ATTACHED_END' });
}

function* attachedErr() {
  yield take('ATTACHED_START_1');
  const task1 = yield fork(fetchResource, 'users', 10);
  const task2 = yield fork(fetchResource, 'comments');
  const take3 = yield fork(errorR, 'error_1', 50);
  yield delay(500);
  yield put({ type: 'ATTACHED_END' });
}

function* attachedTask() {
  try {
    const task1 = yield fork(fetchResource, 'users');
    const task2 = yield fork(fetchResource, 'comments', 10000);
    yield delay(10000);
    yield put({ type: 'ATTACHED_TASK_END' });
  } finally {
    if (yield cancelled()) {
      yield put({ type: 'ATTACHED_TASK_BE_CANCEL' });
    }
  }
}

function* attachedCancel() {
  while (true) {
    yield take('ATTACHED_START_2');
    const task = yield fork(attachedTask);
    const action = yield take(['ATTACHED_START_2_END', 'ATTACHED_TASK_END']);
    if (action.type == 'ATTACHED_START_2_END') {
      yield cancel(task);
    }
  }
}

function* detached() {
  yield take('DETACHED');
  const task1 = yield spawn(fetchResource, 'users', 10);
  const task2 = yield spawn(fetchResource, 'comments');
  const take3 = yield spawn(errorR, 'error_1', 50);
  yield delay(500);
  yield put({ type: 'DETACHED_END' });
}

export default function* () {
  yield all([
    attached(), //
    attachedErr(),
    attachedCancel(),
    detached(),
  ]);
}
