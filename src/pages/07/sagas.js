import { all } from 'redux-saga/effects';

import tl from './sagas/takeleading';
import t2 from './sagas/take';
import t3 from './sagas/takeend';
import t4 from './sagas/fork';

export default function* () {
  yield all([
    tl(), //
    t2(),
    t3(),
    t4(),
  ]);
}
