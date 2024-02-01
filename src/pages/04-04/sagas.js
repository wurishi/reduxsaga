import {
  all,
  call,
  cancelled,
  delay,
  put,
  race,
  take,
} from 'redux-saga/effects';

function mockFetch(url) {
  return new Promise((r) => {
    setTimeout(() => {
      r(url);
    }, 1000);
  });
}

function* waitStart() {
  while (true) {
    const action = yield take('04-04');
    yield fetchPostsWithTimeout(action.time);
  }
}

function* fetchPostsWithTimeout(time) {
  const { posts, timeout } = yield race({
    posts: call(mockFetch, '/posts'),
    timeout: delay(time),
  });
  if (posts) {
    yield put({ type: 'POSTS_RECEIVED', posts });
  } else {
    yield put({ type: 'TIMEOUT_ERROR' });
  }
}

function* backgroundTask() {
  try {
    while (true) {
      yield delay(1000);
      yield put({ type: 'REFRESH', time: Date.now() });
    }
  } catch (error) {
  } finally {
    if (yield cancelled()) {
      yield put({ type: '主动取消了' });
    }
  }
}

function* watchStartBackgroundTask() {
  while (true) {
    yield take('START_BACKGROUND_TASK');
    yield race({
      task: call(backgroundTask),
      cancel: take('CANCEL_TASK'),
    });
  }
}

export default function* () {
  yield all([
    waitStart(), //
    watchStartBackgroundTask(),
  ]);
}
