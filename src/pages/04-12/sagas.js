import { buffers } from 'redux-saga';
import { actionChannel, all, call, delay, put, take } from 'redux-saga/effects';
import { countdownSaga } from './ecsaga';
import { channelWatchRequests } from './csaga';

function* handleRequest(url) {
  yield delay(1000);
  yield put({ type: 'REQUEST_SUCCESS', url });
}

function* watchRequests() {
  const requestChan = yield actionChannel('REQUEST', buffers.sliding(5));
  while (true) {
    const { url } = yield take(requestChan);
    yield call(handleRequest, url);
  }
}

export default function* () {
  yield all([
    watchRequests(), //
    countdownSaga(),
    channelWatchRequests(),
  ]);
}
