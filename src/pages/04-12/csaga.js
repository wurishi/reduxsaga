import { call, delay, fork, put, take } from 'redux-saga/effects';
import { channel } from 'redux-saga';

export function* channelWatchRequests() {
  // 创建一个 channel 队列
  const chan = yield call(channel);

  // 创建 3 个 worker threads
  for (let i = 0; i < 3; i++) {
    yield fork(handleRequest, chan);
  }

  while (true) {
    const { payload } = yield take('CHANNEL_REQUEST');
    yield put(chan, payload);
  }
}

let _name = 0;
function* handleRequest(chan) {
  const name = 'NAME_' + ++_name;
  while (true) {
    const payload = yield take(chan);
    yield delay(payload.time);
    yield put({
      type: 'SUCC_' + name,
      payload,
    });
  }
}
