import { all, put, select, take, takeEvery } from 'redux-saga/effects';

// takeEvery 版本
function* watchAndLog() {
  yield takeEvery('*', function* logger(action) {
    const state = yield select();

    console.log('action', action);
    console.log('state after', state);
  });
}

// take 版本
function* watchAndLog_take() {
  while (true) {
    const action = yield take('*');
    const state = yield select();

    console.log('action', action);
    console.log('state after', state);
  }
}

function* watchFirstThreeAction() {
  for (let i = 0; i < 3; i++) {
    const action = yield take('*');
  }
  yield put({ type: 'SHOW_CONGRATULATION' });
}

export default function* () {
  yield all([
    // watchAndLog(), //
    watchAndLog_take(),
    watchFirstThreeAction(),
  ]);
}
