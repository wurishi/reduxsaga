import { all } from 'redux-saga/effects';

import { changeColorSaga } from './saga1';
import { doStuffThenChangeColor } from './saga2';
import { callApiTask } from './saga3';

export default function* () {
  yield all([
    changeColorSaga(), //
    doStuffThenChangeColor(),
    callApiTask(),
  ]);
}
