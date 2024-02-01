import { eventChannel, END } from 'redux-saga';
import { call, cancelled, put, take } from 'redux-saga/effects';

function countdown(secs) {
  return eventChannel((emitter) => {
    const iv = setInterval(() => {
      secs -= 1;
      if (secs > 0) {
        emitter(secs);
      } else {
        emitter(END); // 这里会导致 channel 关闭
      }
    }, 1000);
    return () => {
      clearInterval(iv);
    };
  });
}

export function* countdownSaga() {
  yield take('SECOND_START');
  const chan = yield call(countdown, 5);
  // console.log(chan);
  try {
    while (true) {
      const seconds = yield take(chan);
      yield put({ type: 'SECOND', seconds });
    }
  } finally {
    yield put({ type: 'SECOND_END' });
    if (yield cancelled()) {
      chan.close();
    }
  }
}
