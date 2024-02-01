import {
  call,
  cancelled,
  delay,
  fork,
  put,
  spawn,
  take,
  throttle,
} from 'redux-saga/effects';
import { END, eventChannel } from 'redux-saga';

function createEventChannel(dom) {
  return eventChannel((emitter) => {
    const handler = (e) => {
      if (e.key === 'Enter') {
        emitter(END);
      } else {
        emitter(e.key);
      }
    };
    dom.addEventListener('keydown', handler);
    return () => {
      dom.removeEventListener('keydown', handler);
    };
  });
}

export default function* watchInput() {
  yield fork(logInputSaga);
  while (true) {
    const { payload } = yield take('01_WATCH');
    yield fork(watchSaga, payload.dom);
    yield take('01_WATCH_END');
  }
}

function* logInputSaga() {
  // while (true) {
  //   const action = yield take('01_INPUT');
  //   yield call(logInput, action);
  // }
  yield throttle(500, '01_INPUT', logInput);
}

function logInput({ key }) {
  // yield put({ type: '01_INPUT_LOG', key });
  console.log(key);
}

function* watchSaga(dom) {
  const chan = yield call(createEventChannel, dom);
  try {
    while (true) {
      const k = yield take(chan);
      if (k !== END) {
        yield put({ type: '01_INPUT', key: k });
      }
    }
  } catch (error) {
  } finally {
    yield put({ type: '01_WATCH_END' });
    if (yield cancelled()) {
      chan.close();
    }
  }
}
