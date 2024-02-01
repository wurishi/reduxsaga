import {} from 'redux-saga';
import { delay, put, takeEvery, takeLeading } from 'redux-saga/effects';

function* fn(time, action) {
  yield delay(1000);
  yield put({
    type: 'TAKE_LEADING_RECEIVE',
    time,
    payload: action.payload.time,
  });
}

export default function* () {
  yield takeLeading('TAKE_LEADING', fn, Date.now());
}
