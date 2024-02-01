import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

let tmp = 0;
function mockAPI(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      tmp++;
      if (tmp % 5 === 0) {
        reject(new Error('随机错误'));
        return;
      }
      resolve({
        no: 200,
        data: {
          userId,
          name: 'Test Name',
        },
      });
    }, 1000);
  });
}

function* fetchUser(action) {
  try {
    const res = yield call(mockAPI, action.payload.userId);
    yield put({ type: 'USER_FETCH_SUCCESS', user: res.data });
  } catch (error) {
    yield put({ type: 'USER_FETCH_FAILED', message: error.message });
  }
}

function* mySaga() {
  yield takeEvery('USER_FETCH_REQUESTED', fetchUser);
}

// 也可以使用 takeLatest

export default mySaga;
