import { END } from 'redux-saga';
import {
  all,
  apply,
  call,
  cancelled,
  delay,
  fork,
  put,
  take,
  takeMaybe,
} from 'redux-saga/effects';

function* t1() {
  try {
    while (true) {
      yield take('3_TAKE');
      // yield fork(mock); 需要在 finally 中手动 cancel fork task
      yield call(mock); // 3_TAKE_FINALLY 会一直等到 call(mock) 结束之后
    }
  } catch (error) {
  } finally {
    if (yield cancelled()) {
      yield put({ type: '3_TAKE_CANCELLED' });
    }
    yield put({ type: '3_TAKE_FINALLY' });
  }
}

function* mock() {
  try {
    yield delay(2000);
    yield put({ type: '3_TAKE_RECRIVE' });
  } catch (error) {
  } finally {
    yield put({ type: 'mock_finally' });
  }
}

function* t2() {
  try {
    while (true) {
      const action = yield takeMaybe(['3_TAKE']);
      yield delay(1000);
      yield put({ type: '3_TAKE_RECRIVE_t2', payload: action.payload });
    }
  } catch (error) {
  } finally {
    yield put({ type: '3_TAKE_FINALLY_t2' });
  }
}

const obj = {
  name: 'AFK',
  sayHi() {
    console.log(this.name);
  },
};

const obj2 = {
  name: 'OBJ2',
};

function* t3() {
  while (true) {
    const action = yield take('*');
    // yield call([obj2, obj.sayHi]);
    yield call([obj, 'sayHi']);
    // yield apply(obj, 'sayHi', []);
  }
}

export default function* () {
  yield all([
    t1(), //
    t2(),
    t3(),
  ]);
}
