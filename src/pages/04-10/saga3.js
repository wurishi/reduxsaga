import { call, delay, put, select, take } from 'redux-saga/effects';

export function* callApi(url) {
  const someValue = yield select((store) => store['04-10'].color);
  try {
    yield delay(1000);
    yield put({ type: 'success', url, someValue });
    return someValue;
  } catch (error) {
    yield put({ type: 'error', error });
  }
}

export function* callApiTask() {
  while (true) {
    const action = yield take('CALL');
    yield call(callApi, action.url);
  }
}
