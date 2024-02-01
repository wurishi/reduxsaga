import { all } from 'redux-saga/effects';

import throttling from './sagas/throttling';
import debouncing from './sagas/debouncing';

export default function* () {
  yield all([
    throttling(), //
    debouncing(),
  ]);
}
