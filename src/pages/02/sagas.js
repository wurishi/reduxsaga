import {
  all,
  call,
  delay,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

export function* helloSaga() {
  console.log('Hello Sagas!');
}

export function* incrementAsync() {
  yield delay(1000);
  yield put({ type: 'INCREMENT' });
}

export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

export default function* rootSaga() {
  yield all([
    helloSaga(), //
    watchIncrementAsync(),
    watchRandomNum(),
  ]);
}

export function* randomNum(action) {
  yield delay(1000);
  yield put({ type: 'RANDOM_NUM', num: action.num });
}

export function* watchRandomNum() {
  yield takeEvery('RANDOM_NUM_ASYNC', randomNum);
}

export function* fetchProducts() {
  const products = yield call(() => {
    new Promise((r) => setTimeout(() => r('Products'), 1000));
  });
  console.log(products);
}

export function* watchFetchProducts() {
  yield takeEvery('PRODUCTS_REQUESTED', fetchProducts);
}
