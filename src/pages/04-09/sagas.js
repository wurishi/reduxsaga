import { all, cancel, delay, fork, put, take } from 'redux-saga/effects';

function* mock(action) {
  yield delay(1000);
  yield put({ type: 'END_' + action.type });
}

const takeEvery = (pattern, saga, ...args) =>
  fork(function* () {
    while (true) {
      const action = yield take(pattern);
      yield fork(saga, ...args.concat(action));
    }
  });

function* everyTask() {
  yield take('START_EVERY_TASK');
  yield takeEvery(['one_every', 'two_every'], mock);
}

const takeLatest = (pattern, saga, ...args) =>
  fork(function* () {
    let lastTask;
    while (true) {
      const action = yield take(pattern);
      if (lastTask) {
        yield cancel(lastTask); // 如果任务已经结束, cancel 为空操作
      }
      lastTask = yield fork(saga, ...args.concat(action));
    }
  });

function* latestTask() {
  yield take('START_LATEST_TASK');
  yield takeLatest(['three_latest', 'four_latest'], mock);
}

export default function* () {
  yield all([
    everyTask(), //
    latestTask(),
  ]);
}
