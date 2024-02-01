import { runSaga } from 'redux-saga';
import { put } from 'redux-saga/effects';

import { callApi } from './saga3';

test('test callApi', async () => {
  const dispatched = [];
  const result = await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
      getState: () => ({
        '04-10': {
          color: 'mock color',
        },
      }),
      // subscribe: 
    },
    callApi,
    'http://url'
  ).toPromise();
  expect(dispatched.length).toEqual(1);
  expect(dispatched[0]).toEqual({
    type: 'success',
    url: 'http://url',
    someValue: 'mock color',
  });
});
