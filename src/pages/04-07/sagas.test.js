import { forkFn, task2 } from './sagas';
import { cancel, fork, take } from 'redux-saga/effects';
import { createMockTask } from '@redux-saga/testing-utils';

test('forkFn', () => {
  const gen = forkFn();

  expect(gen.next().value).toEqual(take('START_FORK'));
  expect(gen.next().value).toEqual(fork(task2));

  const mockTask = createMockTask();

  expect(gen.next(mockTask).value).toEqual(take('CANCEL_FORK'));

  const cancelYield = cancel(mockTask);
  expect(gen.next().value).toEqual(cancelYield);
});
