const { take, put, all } = require('redux-saga/effects');

function* take1() {
  const action = yield take();
  yield put({ type: 'TAKE_1_RECEIVE', action });
}

function* take2() {
  const action = yield take((action) => {
    return action.payload && action.payload.TMP === 'TMP';
  });
  yield put({ type: 'TAKE_2_RECEIVE', action });
}

function* take3() {
  // function testFn(action) {
  //   return action.type === 'TAKE_3a';
  // }
  // const testFn = {};
  // testFn.__proto__.toString = function () {
  //   return 'TAKE_3';
  // };
  // const action = yield take(testFn);
  // yield put({ type: 'TAKE_3_RECEIVE', action });
}

export default function* () {
  yield all([
    take1(), //
    take2(),
    take3(),
  ]);
}
