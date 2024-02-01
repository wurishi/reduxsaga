import {} from 'redux-saga';
import {
  call,
  cancel,
  delay,
  fork,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects';

export default function* () {
  // let task;
  // while (true) {
  //   const action = yield take('02_INPUT');
  //   if (task) {
  //     yield cancel(task);
  //   }
  //   task = yield fork(input, action);
  // }
  yield takeLatest('02_INPUT', input);
}

function* input({ payload }) {
  yield delay(1000);
  yield put({ type: '02_INPUT_LOG', payload });
}
