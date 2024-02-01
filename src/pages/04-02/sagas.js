import {
  all,
  call,
  cancel,
  cancelled,
  fork,
  put,
  take,
} from 'redux-saga/effects';

function* loginFlow() {
  while (true) {
    const { user, password } = yield take('LOGIN_REQUEST');
    const token = yield call(authorize, user, password);
    if (token) {
      yield put({ type: 'STORE_TOKEN', token });
      yield take('LOGOUT');
      yield put({ type: 'CLEAR_tOKEN' });
    }
  }
}

function* newLoginFlow() {
  while (true) {
    const { user, password } = yield take('LOGIN_REQUEST');
    const task = yield fork(authorize, user, password);
    const action = yield take(['LOGOUT', 'LOGIN_ERROR']);
    if (action.type === 'LOGOUT') {
      yield cancel(task);
    }
    yield put({ type: 'CLEAR_TOKEN' });
  }
}

function mockAPI(user, password) {
  return new Promise((r) => {
    setTimeout(() => {
      console.log('mock');
      r('TOKEN_' + user + '@' + password);
    }, 1000);
  });
}

function* authorize(user, password) {
  try {
    const token = yield call(mockAPI, user, password);
    yield put({ type: 'LOGIN_SUCCESS', token });
    return token;
  } catch (error) {
    yield put({ type: 'LOGIN_ERROR', error });
  } finally {
    if (yield cancelled()) {
      console.log('被主动取消了');
    }
  }
}

function timeout(time) {
  return new Promise((r, reject) => {
    setTimeout(() => {
      // if (time == 200) {
      //   reject(new Error('Error 200'));
      //   return;
      // }
      r(time);
    }, time);
  });
}

function* helloAll() {
  const times = yield all([
    call(timeout, 100),
    call(timeout, 200),
    call(timeout, 5000),
  ]);
  console.log(times);
}

export default function* () {
  yield all([
    // loginFlow(), //
    newLoginFlow(),
    helloAll(),
  ]);
}
