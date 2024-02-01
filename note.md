[参考链接](https://redux-saga-in-chinese.js.org/)

# Redux Sage

## 01: 概述

redux-sage 是一个用于管理应用程序 Side Effect 的 library, 它的目标是让副作用管理更容易, 执行更高效, 测试更简单, 在处理故障时更容易.

可以想像为, 一个 sage 就像是应用程序中的一个单独的线程, 它独自负责处理副作用. redux-sage 是一个 redux 的中间件, 意味着这个线程可以通过正常的 redux action 从主应用程序启动, 暂停和取消, 它也能访问完整的 redux state, 也可以 dispatch redux action.

redux-sage 使用了 ES6 的 Generator 功能, 让异步的流程更易于读取, 写入和测试. 通过 Generator 让异步的流程看起来就像是标准的同步 JavaScript 代码. (有点像 async / await, 但 Generator 还有一些更棒而且我们也需要的功能).

不同于 redux-thunk, 你不会再遇到回调地狱, 你可以很容易地测试异步流程并保持你的 action 是干净的.

### 01-00: Generator 介绍

[JavaScript Generators 权威指南](https://github.com/gajus/gajus.com-blog/blob/master/posts/the-definitive-guide-to-the-javascript-generators/index.md)

[ES6 Generators 基础](https://davidwalsh.name/es6-generators)

[深入 ES6 generators](https://2ality.com/2015/03/es6-generators.html)

[3 cases where JavaScript generators rock](https://goshakkk.name/javascript-generators-understanding-sample-use-cases/)

### 01-01: 开始

#### 安装

```bash
npm i redux-saga
```

或者, 可以直接在 HTML 页面的 `<script>`标签中使用提供的 UMD 构建文件.

#### 示例 01-01

## 02: 入门教程

一个计数器例子作为入门教程

代码可测试:

```bash
npm i -D jest
```

见 saga.spec.js

## 03: 基础概念

### 03-01: 使用 Saga 辅助函数

redux-saga 提供了一些辅助函数, 包装了一些内部方法, 用来在一些特定的 action 被发起到 Store 时派生任务.

`takeEvery`是最常见的, 它提供了类似 redux-thunk 的行为.

要注意的是, `takeEvery`允许多个生成器函数同时启动. 如:

```js
function* fetchData(action) {
    try {
        const data = yield call(Api.fetchUser, action.payload.url);
        yield put({type: 'FETCH_SUCCESS', data});
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* watchFetchData() {
    yield takeEvery('FETCH_REQUESTED', fetchData);
}
```

在上面这个例子中, `takeEvery`允许多个 `fetchData`实例同时启动. 如果 只想得到最新的数据, 可以使用 `taskLatest`

和 `takeEvery`不同, 在任何时刻, `takeLatest`只允许一个 `fetchData`任务在执行. 并且这个任务是最后被启动的那个. 如果已经有一个任务在执行的时候又启动了另一个, 那么之前的那个任务会被自动取消.

### 03-02: 声明式 Effects

在 `redux-saga`的世界里, Sagas 都用 Generator 函数实现. 我们从 Generator 里 yield 纯 JavaScript 对象以表达 Saga 逻辑, 这些对象被称为 Effect. Effect 是一个简单的对象, 这个对象包含了一些给 middleware 解释执行的信息. 可以把 Effect 看作是发送给 middleware 的指令以执行某些操作 (调用某些异步函数, 发起一个 action 到 store, 等等)

`redux-saga/effects`包里提供了许多函数来创建 Effect.

Sagas 可以 yield 多种形式的 effect. 最简单的方式就是 yield 一个 Promise.

```js
// 假设 Api.fetch 返回一个 Promise
// 为什么 sagas 中不直接这样写
function* fetchData() {
    const products = yield Api.fetch('./products');
}
```

主要是为了单元测试时的方便, 单元测试时, 只需要保存 fetchData 任务 yield 一个调用正确的函数并且有着正确的参数即可. 这样就能用 equal 编写简单与可靠的测试用例了.

所以, 相比于在 Generator 中直接调用异步函数, 更好的方法是仅仅 yield 一条描述函数调用的信息. 也就是说, 可以简单的 yield 一个看起来像下面这样的对象:

```js
// Effect -> 调用 Api.fetch 并传递 './products' 作为参数
{
    CALL: {
        fn: Api.fetch,
        args: ['./poducts']
    }
}
```

出于这个原因, redux-saga 提供了一个不一样的方式来执行异步调用.

```js
import { call } from 'redux-saga/effects';

function* fetchData() {
    const products = yield call(Api.fetch, '/products');
}
```

使用 `call(fn, ...args)`这个函数, 与之前的例子不同, 现在不会立即执行异步调用, 相反, `call`创建了一条描述结果的信息. 这样就能够更容易的测试 Generator 函数. 因为, 即使在 Redux 环境之外, `call`也只是返回一个纯文本对象的函数而已.

这就是 **声明式调用 (declarative calls)** 的优势.

`call`支持调用对象方法, 可以使用以下的形式, 为调用的函数提供一个 `this`上下文.

```js
yield call([obj, obj.method], arg1, arg2, ...); // 等同于 obj.method(arg1, arg2, ...)
```

`apply`提供了另外一种调用的方式:

```js
yield apply(obj, obj.method, [arg1, arg2, ...])
```

`call`和 `apply`非常适合返回 Promise 结果的函数. 另外一个函数 `cps`可以用来处理 Node 风格的函数, 即 callback 为 `(error, result) => {}` 这样的形式. CPS 表示的是延续传递风格 (Continuation Passing Style).

比如:

```js
const content = yield cps(readFile, '/path/to/file');
```

### 03-03: 发起 action 到 store

如果要发起一些 action 通知 Store, 可以找到 Store 的 `dispatch`函数.

```js
function* fetchProducts(dispatch) {
    const products = yield call(Api.fetch, '/products');
    dispatch({ type: 'PRODUCTS_RECEIVED', products });
}
```

然后, 该解决方案和上一节中的在 Generator 内部直接调用函数有着相同的缺点, 即如果我们要测试 `fetchProducts`, 则需要模拟 AJAX 响应之后的 dispatch.

相反的, 我们需要同样的使用声明式的解决方案, 即对于 Generator 而言我们要测试的仅是检查 yield 之后的 effect, 是否包含了正确的指令.

redux-saga 为此提供了另外一个函数 `put`, 这个函数用于创建 dispatch Effect.

```js
import { call, put } from 'redux-saga/effects';

function* fetchProducts() {
    const products = yield call(Api.fetch, '/products');
    yield put({ type: 'PRODUCTS_RECEIVED', products });
}
```

此时测试 fethProducts, 就很简单, 只需要检查 yield 是否是一个 dispatch 指令即可.

### 03-04: 错误处理

使用 `try/catch`

### 03-05: Effect

概括来说, 从 Saga 内部触发的异步操作 (Side Effect) 总是由 yield 一些声明式的 Effect 来完成的. (你也可以直接 yield Promise, 但是这会让测试变得困难)

一个 Saga 所做的实际上是组合那些 Effect, 实现其所需的控制流. 最简单的例子是直接把 yield 一个接一个地放置来对序列化 yield Effect. 当然也可以使用熟悉的控制流操作 (if, while, for) 来实现更复杂的控制流.

## 04: 高级

### 04-01: 监听未来的 action

`takeEvery`/ `takeLatest`只是一个在强大的低阶 API 之上构建的 wrapper effect. 接下来使用一个新的 Effect`take`. `take`让我们通过全面控制 action 观察进程来构建复杂的控制流成为可能.

一个简单的日志记录器:

```js
function* watchAndLog_take() {
  while (true) {
    const action = yield take('*');
    const state = yield select();

    console.log('action', action);
    console.log('state after', state);
  }
}
```

`take`就像我们更早之前看到的 `call`和 `put`. 它创建另一个命令对象, 告诉 middleware 等待一个特定的 action. 正如在 `call`Effect 的情况中, middleware 会暂停 Generator, 直到返回的 Promise 被 resolve. 在 `take`情况中, 它将会暂停 Generator 直到一个匹配的 action 被发起.

注意, 这里使用了一个无限循环 `while(true)`. 因为它是一个 Generator 函数, 所以它不具备 `从运行至完成(run-to-completion behavior)`的行为. Generator 将在每次迭代阻塞以等待 action 发起.

在`takeEvery`的情况中, 被调用的任务无法控制何时被调用, 它将在每次 action 被匹配时一遍遍地调用. 并且它们也无法控制何时停止监听.

而在 `take`的情况中, 控制恰恰相反. 与 action 被 `推向(pushed)`的任务处理函数不同, Saga 是自己主动 `拉取(pulling)`action 的.

这样的反向控制让我们可以使用传统的 push 方法实现不同的控制流程.

比如我们希望监听用户发送三次 action 之后, 显示祝贺信息:

```js
function* watchFirstThreeAction() {
  for (let i = 0; i < 3; i++) {
    const action = yield take('*');
  }
  yield put({ type: 'SHOW_CONGRATULATION' });
}
```

与 `while(true)`不同, 这里运行了一个只迭代三次的 `for`循环, 在 `take`初次的3个 action 之后, saga 会发送一条祝贺信息的 action 然后结束. 这意味着 Generator 会被回收并且相应的监听不会再发生.

主动拉取 action 的另一个好处是我们可以使用熟悉的同步风格来描述控制流. 举个例子, 假设我们希望实现一个这样的登录控制流, 有两个 action 分别是 `LOGIN`和 `LOGOUT`. 使用 `takeEvery`或 redux-thunk 我们必须要写两个分别的任务或 thunks : 一个用于 `LOGIN`, 另一个用于 `LOGOUT`.

结果就是逻辑被分开在两个地方, 并且在阅读代码时为了搞明白情况, 还需要在大脑中重新排列它们从而重建控制流模型.

使用拉取(pull)模式, 则可以让我们在同一个地方写控制流, 而不是重复处理相同的 action.

```js
function* loginFlow() {
    while(true) {
        yield take('LOGIN');
        // ...
        yield take('LOGOUT');
        // ...
    }
}
```

这样的 saga 会更好理解, 因为序列中的 actions 就是我们期望中的. 它知道 `LOGIN`action 后面应该始终跟着一个 `LOGOUT`action.

### 04-02: 无阻塞调用

```js
function* loginFlow() {
  while (true) {
    const { user, password } = yield take('LOGIN_REQUEST');
    const token = yield call(authorize, user, password);
    if (token) {
      yield put({ type: 'STORE_TOKEN', token });
      yield take('LOGOUT');
      yield put({ type: 'CLEAR_tOKEN' });
    }
  }
}
```

这样的 loginFlow 有一个问题, 即在等待 authorize 时, 如果触发了 `LOGOUT` action, 因为此时 generator 还被阻塞在 `yield call(authorize, user, password)`处, 导致 `LOGOUT`会被错过. 这是因为 `call`是一个会阻塞的 Effect, 即 Generator 在调用它结束之前是不能执行或处理其他事情的. 但在这里, 我们希望 `LOGOUT`与 `authorize`是并发的, 所以我们需要以非阻塞的形式调用 `authorize`方法. 这样 loginFlow 就能继续执行, 并且监听并发的响应.

redux-saga 提供了一个表示无阻塞调用的 Effect: `fork`. 当我们 fork 一个任务时, 任务会在后台启动, 调用者可以继续自己的流程, 而不用等待被 fork 的任务结束.

```js
function* newLoginFlow() {
  while (true) {
    const { user, password } = yield take('LOGIN_REQUEST');
    yield fork(authorize, user, password);
    yield take(['LOGOUT', 'LOGIN_ERROR']);
    yield put({ type: 'CLEAR_TOKEN' });
  }
}
```

`yield take(['LOGOUT', 'LOGIN_ERROR'])`意思是监听 2 个并发的 action.

但还没完, 如果 `authorize`和 `LOGOUT`是并发调用了, 那么我们需要在收到 `LOGOUT`时, 取消 `authorize`的任务, 否则 `authorize`成功获取响应(或失败的应用)后还是会发起一个 `LOGIN_SUCCESS`或 `LOGIN_ERROR`, 这将导致状态不一致.

为了取消 fork 任务, 我们可以使用一个指定的 Effect `cancel`.

```js
function* newLoginFlow() {
  while (true) {
    const { user, password } = yield take('LOGIN_REQUEST');
    const task = yield fork(authorize, user, password);
    const action = yield take(['LOGOUT', 'LOGIN_ERROR']);
    if (action.type === 'LOGOUT') {
      yield cancel(task);
    }
    yield put({ type: 'CLEAR_TOKEN' });
  }
}
```

另外 `cancel`Effect 并不是粗暴地结束了 `authorize`任务, 相反, 它会给予任务一个机会用来执行清理的逻辑, 那就是 `cancelled`Effect.

```js
function* authorize(user, password) {
  try {
    const token = yield call(mockAPI, user, password);
    yield put({ type: 'LOGIN_SUCCESS', token });
    return token;
  } catch (error) {
    yield put({ type: 'LOGIN_ERROR', error });
  } finally {
    if (yield cancelled()) {
      console.log('被主动取消了');
    }
  }
}
```

### 04-03: 同时执行多个任务

`yield`指令可以很简单的将异步控制流以同步的写法表现出来, 但如果要同时执行多个任务, 不能像下面这样写:

```js
const users = yield call(fetch, '/users'),
      repos = yield call(fetch, '/repos');
```

因为这样写, 第二个 effect 将会在第一个 `call`执行完毕之后才开始, 所以应该这样写:

```js
const [users, repos] = yield all([
    call(fetch, '/users'),
    call(fetch, '/repos')
]);
```

当 `yield all`一个包含 effects 的数组时, generator 会被阻塞直到所有的 effects 都执行完毕, 或者当其中一个 effect 被拒绝 (就像 `Promise.all`的行为)

### 04-04: 在多个 Effects 之间启动 race

下面的示例演示了触发一个远程请求, 并且限制在1秒内响应, 否则作超时处理.

```js
function* fetchPostsWithTimeout(time) {
  const { posts, timeout } = yield race({
    posts: call(mockFetch, '/posts'),
    timeout: delay(time),
  });
  if (posts) {
    yield put({ type: 'POSTS_RECEIVED', posts });
  } else {
    yield put({ type: 'TIMEOUT_ERROR' });
  }
}
```

`race`的另一个有用的功能是, 它会自动取消那些失败的 Effects.

```js
function* backgroundTask() {
  try {
    while (true) {
      yield delay(1000);
      yield put({ type: 'REFRESH', time: Date.now() });
    }
  } catch (error) {
  } finally {
    if (yield cancelled()) {
      yield put({ type: '主动取消了' });
    }
  }
}

function* watchStartBackgroundTask() {
  while (true) {
    yield take('START_BACKGROUND_TASK');
    yield race({
      task: call(backgroundTask),
      cancel: take('CANCEL_TASK'),
    });
  }
}
```

当 `CANCEL_TASK`被发起时, `race`会自动取消 `backgroundTask`, 并且 `backgroundTask`中的 finally 块将被执行到并发现自己被 `cancelled`了.

### 04-05: 使用 yield* 对 Sagas 进行排序

可以使用内置的 `yield*`操作符来组合多个 Sagas, 使得它们保持顺序.

```js
function* game() {
  const score1 = yield* play1();
  const score2 = yield* play2();
  const score3 = yield* play3();
  yield put(showScore(score1));
  yield put(showScore(score2));
  yield put(showScore(score3));
}
```

### 04-06: 组合 Sagas

虽然使用 `yield*`是提供组合 Sagas 的惯用方式, 但这个方法也有一些局限性:

- 如果想要单独测试嵌套的 Generator, 这导致了一些重复的测试代码和重复执行的开销.
- `yield*`只允许任务顺序组合, 所以一次只能 `yield*`一个 Generator.

所以使用 `all`/ `race`等组合 API 可以更加自由的组合各种 saga.

```js
function* mainTask() {
  const scores = yield all([call(task1), call(task2), call(task1)]);
  yield put({ type: 'SCORES', scores });
}
```

```js
function* game() {
  let finished = false;
  while (!finished) {
    yield take('GAME_START');

    const { score, timeout } = yield race({
      score: call(play),
      timeout: delay(5000),
    });

    if (!timeout) {
      finished = true;
      yield put({ type: 'GAME_STOP' });
      yield put({ type: 'SHOW_SCORE', score });
    } else {
      yield put({ type: 'GAME_RESTART' });
    }
  }
}
```

### 04-07: 取消任务

一旦任务被 fork , 可以使用 `yield cancel(task)`来中止任务的执行. 

#### 取消传播

要注意的是取消消息是会不断的往下传播的(相对的, 被回传的值和没有捕捉的错误是不断往上). 

```js
function* task1() {
  try {
    yield call(task2);
  } finally {
    if (yield cancelled()) {
      yield put({ type: 'task1 canceled' });
    }
  }
}

function* task2() {
  try {
    while (true) {
      yield delay(1000);
    }
  } finally {
    if (yield cancelled()) {
      yield put({ type: 'task2 canceled' });
    }
  }
}

function* task() {
  yield take('START_TASK');
  const { task, cancel } = yield race({
    task: call(task1),
    cancel: take('CANCEL_TASK'),
  });
}
```

当触发 `CANCEL_TASK`时, task1 被取消的同时, task2 也会触发取消.

#### 测试 fork effect

```bash
npm i -D @redux-saga/testing-utils
```

```js
import { forkFn, task2 } from './sagas';
import { cancel, fork, take } from 'redux-saga/effects';
import { createMockTask } from '@redux-saga/testing-utils';

test('forkFn', () => {
  const gen = forkFn();

  expect(gen.next().value).toEqual(take('START_FORK'));
  expect(gen.next().value).toEqual(fork(task2));

  const mockTask = createMockTask(); // 创建一个 mockTask, 用来测试取消的情况.

  expect(gen.next(mockTask).value).toEqual(take('CANCEL_FORK'));

  const cancelYield = cancel(mockTask);
  expect(gen.next().value).toEqual(cancelYield);
});
```

#### 自动取消

除了手动调用 `cancel`取消任务之外, 还有一些情况也会自动触发取消.

1. 在 `race`Effect 中, 所有参与 race 的任务, 除了最先完成的任务, 其他任务都会被取消.
2. 并行的 `all`Effect, 一旦其中任何一个任务被拒绝(抛出 Error), 并行的其他未完成的 Effect 都将被自动取消.

### 04-08: redux-saga 的 fork model

在 redux-saga 中, 有 2 个 Effects 可以在后台动态地 fork task.

- `fork`用来创建 attached forks
- `spawn`用来创建 detached forks

#### (一) fork

##### 行为

```js
function* attached() {
  yield take('ATTACHED_START');
  const task1 = yield fork(fetchResource, 'users');
  const task2 = yield fork(fetchResource, 'comments');
  yield delay(500);
  yield put({ type: 'ATTACHED_END' });
}
```

attached 的完整结束其实意味着 3 个 effect 都被成功执行并完成了.

所以以上这种写法也可以用 `all`替换

```js
function* attached() {
    yield all([
        call(fetchResource, 'users'),
        call(fetchResource, 'comments'),
        delay(500)
    ]);
}
```

所以被附加的 fork 与平行的 Effect 共享相同的语意:

- 在平行情况下执行 task
- 在所有被执行的 task 结束后, parent effect 才算是结束

##### Error 传播

```js
function* attachedErr() {
  yield take('ATTACHED_START_1');
  const task1 = yield fork(fetchResource, 'users', 10);
  const task2 = yield fork(fetchResource, 'comments');
  const take3 = yield fork(errorR, 'error_1', 50);
  yield delay(500);
  yield put({ type: 'ATTACHED_END' });
}
```

和 `all`的行为类似, 当 fork 中的一个任务抛出错误后, 其他所有未执行完成的任务都会被取消. (要注意的, 已经完成的任务是无法得知任务被取消的)

##### Cancellation

当 main task 被 `cancel`后, 其他 fork 的正在运行中的任务也会被取消. (**与文档冲突**)

#### (二) spawn

```js
function* detached() {
  yield take('DETACHED');
  const task1 = yield spawn(fetchResource, 'users', 10);
  const task2 = yield spawn(fetchResource, 'comments');
  const take3 = yield spawn(errorR, 'error_1', 50);
  yield delay(500);
  yield put({ type: 'DETACHED_END' });
}
```

使用 spawn 执行的是被分离到它们本身执行上下文的任务. 该任务不会因为父任务的原因而被终止. 所以 spawn 的任务抛出的错误不会冒泡到父任务而导致其他分离的任务被取消. (如果需要取消, 必须明确的手动去取消它们).

简单来说, 被分离的任务, 更像是直接使用 `middleware.run`API 启动的 root Saga.

### 04-09: 并发

之前使用过辅助函数 `takeEvery`和 `takeLatest`effect 来管理 Effects 之间的并发.

现在看看如何使用低阶 Effects 来实现这些辅助函数.

#### takeEvery

```js
const takeEvery = (pattern, saga, ...args) =>
  fork(function* () {
    while (true) {
      const action = yield take(pattern);
      yield fork(saga, ...args.concat(action));
    }
  });
```

#### takeLatest

```js
const takeLatest = (pattern, saga, ...args) =>
  fork(function* () {
    let lastTask;
    while (true) {
      const action = yield take(pattern);
      if (lastTask) {
        yield cancel(lastTask); // 如果任务已经结束, cancel 为空操作
      }
      lastTask = yield fork(saga, ...args.concat(action));
    }
  });
```

### 04-10: 测试 Sagas

有两种主要的测试 Sagas 的方式:

- 一步一步测试 saga generator function
- 执行整个 saga 并断方 side effects

#### 测试 Saga generator function

```js
export function* changeColorSaga() {
  const action = yield take(CHOOSE_COLOR);
  yield put(changeUI(action.payload.color));
}
```

一步一步地测试, 因为 saga 使用声明式的 effect, 所以每一步 yield 其实都是一个可以预测的 plain object:

```js
test('test changeColorSaga', () => {
  const gen = changeColorSaga();
  expect(gen.next().value).toEqual(take(CHOOSE_COLOR));

  const color = 'red';
  expect(gen.next(chooseColor(color)).value) //
    .toEqual(put(changeUI(color)));

  expect(gen.next().done).toEqual(true);
});
```

#### Branching Saga

有时候 saga 可能会有不同的结果, 为了测试不同的 branch 而不重复所有的流程, 可以使用 `cloneableGenerator`(在 `@redux-saga/testing-utils` 中)

```js
export function* doStuffThenChangeColor() {
  yield put(doStuff());
  yield put(doStuff());
  const action = yield take(CHOOSE_NUMBER);
  if (action.payload.number % 2 === 0) {
    yield put(changeUI('red'));
  } else {
    yield put(changeUI('blue'));
  }
}
```

测试 `action.payload.number % 2 === 0`, 可以使用 `cloneableGenerator`, 在流程中间 clone 不同的 gen 用来测试不同的逻辑分支.

```js
const gen = cloneableGenerator(doStuffThenChangeColor)();
  expect(gen.next().value).toEqual(put(doStuff()));
  expect(gen.next().value).toEqual(put(doStuff()));
  expect(gen.next().value).toEqual(take(CHOOSE_NUMBER));
  let clone = gen.clone(); 
  expect(clone.next(chooseNumber(0)).value).toEqual(put(changeUI('red')));
  clone = gen.clone();
  expect(clone.next(chooseNumber(1)).value).toEqual(put(changeUI('blue')));
```

#### 测试完整的 Saga

使用 `runSaga`自定义 put / select 等等的行为, 可以脱离 store 测试完整的 Saga. (见 04-11)

### 04-11: 连接 Sagas 至外部输入和输出

我们已经看到, `take`Effect 的作用是等待 action 被发起到 Store (resolved). `put`Effect 的作用是发起一个 action 来解决问题的, action 会被作为参数传给 Store.

当 Saga 启动后(不管是初始启动, 还是稍后动态启动), middleware 会自动将它的 `take`/ `put`连接至 store. 这2个 Effect 可以被看作是一种 Saga 的输入/输出 (Input/Output).

redux-saga 提供了一种方式在 redux middleware 环境外部运行 Saga, 并可以连接至自定义的输入输出 (Input/Output)

```js
import { runSaga } from 'redux-saga'

function* saga() {}

runSaga({
    dispatch: action => {
        // put 的 action
    },
    getState: () => {
        // 自定义 select 得到的 store
        return {
            state: 'hello world'
        };
    }
}, saga);
```

### 04-12: 使用 Channels

目前为止, 我们使用了 `take`和 `put`来与 Redux Store 进行通信. 而 Channels 则是可以被用来处理这些 Effects 与外部事件源或 Sagas 之间的通信的. 它们还可以用于在 Store 中对特定的 actions 进行排序.

- 使用 `yield actionChannel`Effect 缓存特定的 action.
- 使用 `eventChannel`factory function 连接 `take`Effects 至外部的事件来源.
- 使用通用的 `channel`factory function 创建 `channel`, 并在 `take`/ `put`Effects 中使用它来让两个 Saga 之间通信.

#### 使用 `actionChannel`Effect

```js
function* watchRequests() {
    while(true) {
        const { payload } = yield take('REQUEST');
        yield fork(handleRequest, payload);
    }
}
```

这个例子演示了经典的 watch-and-fort 模式. watchRequests 使用 fork 来避免阻塞, 因此它不会错过任何来自 store 的 action. 但是如果并发产生多个 REQUEST action, 则 handleRequest 会有多个同时执行.

假设我们的需求如下: 每次只处理一个 REQUEST action. 比如有 4 个 REQUEST action 发起了, 但我们想一个个处理, 处理完成第一个 action 之后再处理第二个.

此时我们就需要有一个队列 (queue), 来保存所有未处理的 action. 每当我们处理完当前的 handleRequest 之后, 就可以队列中获取下一个.

Redux-Saga 提供了一个 helper Effect `actionChannel` 就可以为作为这样的一个队列.

```js
function* watchRequests() {
  // 1. 为 REQUEST actions 创建一个 channel
  const requestChan = yield actionChannel('REQUEST');
  while (true) {
    // 2. take from the channel
    const { url } = yield take(requestChan);
    // 3. 这里使用 call 阻塞调用, 所以只有完成了 handleRequest, 才会处理后一个
    yield call(handleRequest, url);
  }
}
```

默认情况下, `actionChannel`会无限制缓存所有传入的消息. 如果想要更多地控制缓存, 可以提供一个 Buffer 参数给 `actionChannel`. Redux-Saga 提供了一些常用的 buffers (none, dropping, sliding), 当然也可以自己实现.

如果只想要处理最近的五个项目(缓存池最多缓存5个, 消费掉后可以继续往里面加):

```js
import { buffers } from 'redux-saga';
import { actionChannel } from 'redux-saga/effects';

function* watchRequests() {
    const requestChan = yield actionChannel('REQUEST', buffers.sliding(5));
    // ...
}
```

#### 使用 `eventChannel`factory 连接外部的事件

`eventChannel`是一个 factory function, 不是一个 Effect. 它可以为 Redux Store 以外的事件来源创建一个 Channel.

每秒发生一个数字:

```js
import { eventChannel, END } from 'redux-saga';
function countdown(secs) {
  return eventChannel((emitter) => {
    const iv = setInterval(() => {
      secs -= 1;
      if (secs > 0) {
        emitter(secs);
      } else {
        emitter(END); // 这里会导致 channel 关闭
      }
    }, 1000);
    return () => {
      clearInterval(iv);
    };
  });
}
```

```js
export function* countdownSaga() {
  const chan = yield call(countdown, 5);
  try {
    while (true) {
      const seconds = yield take(chan);
      yield put({ type: 'SECOND', seconds });
    }
  } finally {
    yield put({ type: 'SECOND_END' });
  }
}
```

通过 `yield call(countdown)`创建一个 `eventChannel`.

通过 `yield take(chan)`获取自定义的事件源中的消息. (这里是每秒接收到一次).

要注意 countdown 函数最后返回了一个函数, 这个是订阅者模式常见的返回一个 `unsubscribe`函数, 该函数用来在事件完成之后处理一些清理工作.

另外, 如果想要在 saga 中主动关闭 channel, 可以使用 `chan.close()`来关闭.

```diff
export function* countdownSaga() {
  const chan = yield call(countdown, 5);
  try {
    while (true) {
      const seconds = yield take(chan);
      yield put({ type: 'SECOND', seconds });
    }
  } finally {
    yield put({ type: 'SECOND_END' });
+   if (yield cancelled()) {
+     chan.close(); // 主动关闭
+   }
  }
}
```

> 注意: eventChannel 上的消息默认不会被缓存, 如果需要缓存, 请手动指定 `eventChannel(subscriber, buffer)`

#### 使用 channels 在 Sagas 之间沟通

```js
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

function* handleRequest(chan) {
  const name = 'NAME_' + ++_name;
  while (true) {
    const payload = yield take(chan); // 从 channel 中获取
    yield delay(payload.time);
    yield put({
      type: 'SUCC_' + name,
      payload,
    });
  }
}
```

上面的例子, 将创建三个 handleRequest 任务, 每次接收到 CHANNEL_REQUEST 消息, 三个 worker 中的一个会被分配去处理请求. 注意在这个机制中, 这 3 个 worker 会有一个自动的负载均衡, 所以快的 worker 不会被慢的 worker 拖慢.

## 05: 技巧

### 05-01: 节流 (Throttling)

```js
function* logInputSaga() {
    while(true) {
        const action = yield take('INPUT');
        yield call(logInput, action);
    }
}
```

上面的 saga 会响应每次 INPUT 事件, 如果想要不这么频繁响应, 可以使用 `throttle`节流.

```js
function* logInputSaga() {
    yield throttle(500, 'INPUT', logInput);
}
```

使用 `throttle`后, 每 500ms 之内, 只有最新的 INPUT 会被 logInput 处理.(第一次响应时可以理解为已经等待500ms了, 所以接收到的第一个 INPUT 就会响应, 后面的则是收集 500ms 内所有的 INPUT action, 最后仅响应最新的那个)

> 注意, 节流不需要 `while(true)`

### 05-02: 防抖动 (Debouncing)

```js
function* () {
    let task;
    while(true) {
        const action = yield take('INPUT');
        if(task) {
            yield cancel(task);
        }
        task = yield fork(logInput, action);
    }
}
```

也可以使用 redux-saga 内置的 `taskLatest`实现:

```js
function* () {
    yield takeLatest('INPUT', logInput);
}
```

节流与防抖的区别:

- 节流控制的是在指定时间范围内最多只能触发一次事件.
- 防抖控制的是二次事件之间的间隔必须不小于某个指定的值.
- 假设在2秒内每100ms触发一次事件.
  - 节流500ms, 即2秒内会在(0, 500ms, 1000ms, 1500ms, 2000ms)这几个时间点响应事件.
  - 防抖500ms, 则每100ms触发的事件会把前一个事件取消. 即最后只会在2100ms时响应事件.

## 06: 外部资源

- [Vuex metts Redux-saga](https://medium.com/@xanf/vuex-meets-redux-saga-e9c6b46555e#.d4318am40)
- [redux-saga-sc](https://www.npmjs.com/package/redux-saga-sc) - 通过 SocketCluster websockets 提供易于 dispatch redux action 的 sagas
- [redux-form-saga](https://www.npmjs.com/package/redux-form-saga) - 一个 action creator 和 saga, 用于整合 Redux Form 和 Redux Saga
- [redux-electron-enhancer](https://www.npmjs.com/package/redux-electron-enhancer) - 用于在多进程中, 同步每个实例之间的 Redux store
- [eslint-plugin-redux-saga](https://www.npmjs.com/package/eslint-plugin-redux-saga) - ESLint rules
- [redux-saga-router](https://www.npmjs.com/package/redux-saga-router) - 响应 route 的改变时执行 sagas
- [vuex-redux-saga](https://github.com/xanf/vuex-redux-saga) - 用于连接 Vuex 和 Redux-Saga 的 Bridge
- [esdoc-saga-plugin](https://www.npmjs.com/package/esdoc-saga-plugin) - ESDoc plugin, 用于记录 sagas effects
- [redux-saga-compose](https://www.npmjs.com/package/redux-saga-compose) - 以 koa-compose 风格来 Compose sagas 为 middleware

## 07: API 参考

### 07-01: Middleware API

#### `createSagaMiddleware(options)`

options: Object

| 属性                                  | 作用                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| sagaMonitor: SagaMonitor              | 如果提供了 Saga onitor, middleware 将向 monitor 传送监视事件. |
| effectMiddlewares: EffectMiddleware[] | 高阶函数 (high order function), 它接受一个内置 emitter 并返回另一个 emitter. |
| onError: Function                     | 当提供该方法时, middleware 将带着 Sagas 中未被捕获的错误调用它. |

```js
const sagaMiddleware = createSagaMiddleware({
    onError(error, errorInfo) {
        // error: JS Error
        // errorInfo: sagaStack saga对于错误的描述信息
    },
    effectMiddlewares: [
        (emitter) => (action) => {
            emitter(action);
        }
    ]
});
```

#### `middleware.run(saga, ...args)`

| 参数名           | 作用                |
| ---------------- | ------------------- |
| saga: Function   | 一个 Generator 函数 |
| args: Array<any> | 提供给 saga 的参数  |

### 07-02: Saga 辅助函数

#### `takeEvery(pattern, saga, ...args)`

在发起 (dispatch) 到 Store 并且匹配 `pattern`的每一个 action 上派生一个 `saga`.

| 参数名                                          | 作用                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| pattern: String \| Array \| Function \| Channel | 可以匹配字符串, 数组, 自定义函数, 或是一个 channel.          |
| saga: Function                                  | Generator 函数.                                              |
| args: Array<any>                                | 传递给启动任务的参数. action 会作为最后一个参数追加到参数列表中. |

`takeEvery`是一个使用 `take`和 `fork`构建的高级 API.

#### `takeLatest(pattern, saga, ...args)`

在发起到 Store 并且匹配 `pattern`的每一个 action 上派生一个 `saga`. 并且自动取消之前所有已经启动但仍在执行中的 `saga`任务.

| 参数名                                          | 作用                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| pattern: String \| Array \| Function \| Channel | 可以匹配字符串, 数组, 自定义函数, 或是一个 channel.          |
| saga: Function                                  | Generator 函数.                                              |
| args: Array<any>                                | 传递给启动任务的参数. action 会作为最后一个参数追加到参数列表中. |

`takeLatest`是一个使用 `take` `fork`和 `cancel`构建的高级 API.

#### `takeLeading(pattern, saga, ...args)`

在发起到 Store 并且匹配 `pattern`的每一个 action 上派生一个 `saga`. 它将在派生一次任务之后阻塞, 直到派生的 saga 完成, 然后再开始监听指定的 pattern.

| 参数名                                          | 作用                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| pattern: String \| Array \| Function \| Channel | 可以匹配字符串, 数组, 自定义函数, 或是一个 channel.          |
| saga: Function                                  | Generator 函数.                                              |
| args: Array<any>                                | 传递给启动任务的参数. action 会作为最后一个参数追加到参数列表中. |

`takeLeading`是一个使用 `take`和 `call`构建的高级 API.

#### `throttle(ms, pattern, saga, args)`

在发起到 Store 并且匹配 `pattern`的每一个 action 上派生一个 `saga`. 它在派生一次任务之后, 仍然会将新传入的 action 接收到底层的 `buffer`中, 并保留最近的一个. 与此同时, 它在 `ms`毫秒内将暂停派生新的任务.

| 参数名                               | 作用                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| ms: Number                           | 在 action 开始处理后, 无视新的 action 的时长. 单位为毫秒.    |
| pattern: String \| Array \| Function | 可以匹配字符串, 数组或自定义函数.                            |
| saga: Function                       | Generator 函数.                                              |
| args: Array<any>                     | 传递给启动任务的参数. action 会作为最后一个参数追加到参数列表中. |

### 07-03: Effect 创建器

> 注意:
>
> - 以下每个函数都会返回一个普通 JavaScript 对象 (plain JavaScript Object), 并且不会执行任何其他操作.
> - 执行是由 middleware 在迭代过程中进行的.
> - middleware 会检查每个 Effect 的描述信息, 并进行相应的操作.

#### `take(pattern)`

命令 middleware 在 Store 上等待指定的 action. 在发起与 `pattern`匹配的 action 之前, Generator 将暂停.

pattern:

- 如果以空参数或 `'*'`调用 `take`, 那么将匹配所有发起的 action. (例如, `take()`将匹配所有 action)
- 如果它是一个函数, 那么将匹配 `pattern(action)`为 true 的 action. (例如, `take(action => action.entities)`将匹配 action 的 entities 为真的 action)
- 如果它是一个字符串, 那么将匹配 `action.type === pattern`的 action. (例如: take('INCREMENT_ASYNC'))
- 如果它是一个数组, 那么数组中的每一项都适用于上述规则 (因此它是支持字符串与函数混用的). 不过最常见的还是纯字符串数组, 其结果就是用 `action.type`与数组中的每一项进行对比. (例如: `take(INCREMENT, DECREMENT)`将匹配 `INCREMENT`或 `DECREMENT`类型的 action)

middleware 提供了一个特殊的 action -- `END`. 如果发起 END action, 则无论哪种 pattern, 只要是被 take Effect 阻塞的 Saga 都会被终止. 且如果被终止的 Saga 下扔有分叉 (forked) 任务还在运行, 那么它还会在终止任务前, 先等待这些子任务的终止.

#### `takeMaybe(pattern)`

与 `take(pattern)`相同, 但在 `END` action 时不会自动终止 Saga.

#### `take(channel)`

用来从指定的 channel 中等待一条特定的消息. 如果 channel 已经被关闭了, 那么 Generator 将会和上面的 `take(pattern)`一样终止.

#### `takeMaybe(channel)`

#### `put(action)`

向 Store 发起一个 action. 这个 effect 是非阻塞型的, 并且所有下游抛出的错误, 都不会冒泡到 saga 中.

#### `putResolve(action)`

类似 `put`, 但 effect 是阻塞型的. (如果从 `dispatch`返回了 promise, 它将会等待其结果), 并且会接收到下游冒泡的错误.

#### `put(channel, action)`

向指定的 channel 中放入一条 action.

#### `call(fn, ...args)`

创建一个 Effect 描述信息, 用来命令 middleware 以参数 `args`调用函数 `fn`

`fn`注意事项:

- `fn`即可以是一个普通函数, 也可以是一个 Generator 函数. middleware 会调用该函数, 并检查其结果.
- 如果结果是一个迭代器对象 (Iterator object), 那么 middleware 将会执行这个 Generator 函数. 父级 Generator 将一直被暂停直到子级 Generator 返回值后才会带着该值恢复执行. 如果子级 Generator 中断报错, 则父级 Generator 也会抛出一个错误.
- 如果结果是一个 Promise, 那么在该 Promise 被 resolve 或 reject 之前, middleware 都将一直暂停 Generator, 直到 resolve 后带着返回值恢复执行, 或是 reject 后抛出一个错误.
- 如果其结果即不是迭代器对象也不是 Promise, 那么 middleware 会立即把该值返回给 saga, 从而让它可以以同步的形式恢复执行.
- 当 Generator 中抛出错误时, 如果有使用 `try/catch`包裹当前的 `yield`指令, 那么控制权将交给 `catch`. 否则, Generator 会因为错误而中断, 并且假设这个 Generator 是由其他 Generator 调用的话, 那么错误还会被传递给调用方.

#### `call([context, fn], ...args)`

类似 `call(fn, ...args)`, 但支持传递 `this`上下文(context)给 `fn`.

#### `call([context, fnName], ...args)`

类似 `call([context, fn], ...args)`, 但支持用字符串表示要调用的 `context`上的函数的名字.

#### `apply(context, fn, [args])`

同 JS Function 的 call 和 apply 的区别.

#### `cps(fn, ...args)`

创建一个 Effect, 命令 middleware 以 Node 风格的函数 (Node style function)的方式调用 `fn`

> Node style function:
>
> 即 middleware 会以 `fn(...arg, cb)` 的形式调用, 如果 `fn`正常结束, 则必定会调用 `cb(null, result)`, 从而告知 middleware 成功的结果. 如果 `fn`遇到了错误, 则必定会调用 `cb(error)`, 告知 middleware 出错.
>
> 在 `fn`终止之前, middleware 会保持暂停状态

#### `fork(fn, ...args)`

让 middleware 以非阻塞调用的形式执行 `fn`.

所有分叉任务 (forked tasks)都会被附加(attach)到它们的父级任务身上. 当父级任务终止其自身的命令被执行时, 它会在返回之前等待所有分叉任务的终止.

来自于子级任务的错误会自动冒泡到它们的父级任务. 而且父级任务因为任何一个子级错误而中断时, 父级的整个执行树(即分叉任务 + 还在运行着的父体扮演的主任务)都会被取消.

一个主分叉任务被取消, 会自动取消所有还在执行的子分叉任务. 如果被取消的任务是被阻塞的话, 这个阻塞的 Effect 也会被取消.

如果一个分叉任务是以同步的形式失败的, 则不会返回 Task , 并且父级任务将被尽快地中断.

#### `spawn(fn, ...args)`

与 `fork(fn, ...args)`类似, 但创建的是**被分离的**任务. 被分离的任务与其父级任务保持独立, 并像顶级任务般工作. 父级任务不会在返回之前等待被分离的任务终止, 并且所有可能影响父级或被分离的任务事件都是完全独立的 (错误, 取消)

#### `join(task)`

用来等待之前的一个分叉任务的结果.

> 注意: `join`解出的结果 (成功或错误)与被连接(join)的任务是相同的. 如果被连接的任务被取消了, 那么该取消信息还会冒泡到执行 join effect 的 saga.

#### `join(...task)`

用来等待之前的多个分叉任务的结果. 大致相当于 `yield tasks.map(t => join(t))`

#### `cancel(task)`

用来命令 middleware 取消之前的一个分叉任务.

#### `cancel(...tasks)`

#### `cancel()`

用来取消 yield 它的任务(自取消)

#### `select(selector, ...args)`

用于在当前 Store 的 state 上调用指定的选择器.

| 参数名             | 作用                                                         |
| ------------------ | ------------------------------------------------------------ |
| selector: Function | 一个 `(state, ...args) => args`的函数. 它接受当前 state 和一些可选参数, 并返回当前 Store state 上的部分数据. |
| args: Array<any>   | 传递给选择器的可选参数, 将追加在 `getState`后.               |

> 注意: 在向 store 发起 action 时, middleware 首先会把 action 转发给 reducers, 然后通知 sagas. 这意味着, 当你查询 Store 的 state 时, 你获得的是 action 被应用后的 state. 但是, 只有所有后续的中间件都是以同步的形式调用 `next(action)`时, 才能保证此行为. 所以建议检查每一个后续的 middleware 的来源, 以确保是通过同步的形式调用 `next(action)`的, 或者确保 redux-saga 是调用链中的最后一个中间件.

最好的情况, Saga 应该是自主独立, 并且不依赖于 Store 的 state. 所以建议将依赖 state 的 selector 放到统一的耦合函数中.

#### `actionChannel(pattern, [buffer])`

创建一个 Effect, 通过一个事件 channel 对匹配的 pattern 的 action 进行排序. 作为可选项, 可以提供一个 buffer 来控制如何缓存排序的 actions.

#### `flush(channel)`

从 channel 中清除所有被缓存的数据. 清除的数据会返回至 saga, 以便在需要的时候再次被使用.

```js
function* saga() {
    const chan = yield actionChannel('ACTION');
    try {
        while(true) {
            const action = yield take(chan);
            //...
        }
    }
    finally {
        const actions = yield flush(chan); // 所有缓存的actions
    }
}
```

#### `cancelled()`

返回该 generator 是否已经被取消.

#### `setContext(props)`

更新当前 saga 上下文. 和 react 的 setState() 类似, 每次执行都是扩展上下文而非代替.

#### `getContext(prop)`

返回当前 saga 上下文中的一个特定属性.

### 07-04: Effect 组合器 (combinators)

#### `race(effects)`

在多个 effect 间运行竞赛(Race)

effects: Object - 一个 `{ label: effect, ... }`形式的字典对象.

#### `race([...effects])`

与 `race(effects)`类似, 但传入的是 effect 数组.

#### `all([...effects])`

并行地运行多个 Effect, 并等待它们全部完成.

#### `all(effects)`

与 `all([...effects])`类似, 只不过传入的是一个带有 label 的 effect 的字典对象.

### 07-05: 接口

#### Task

Task 接口指定了通过 `fork`, `middleware.run`或 `runSaga`运行 Saga 的结果.

| 方法               | 返回值                                                       |
| ------------------ | ------------------------------------------------------------ |
| task.isRunning()   | 若任务还未返回或抛出错误, 则为 true                          |
| task.isCancelled() | 或任务已被取消则为 true                                      |
| task.result()      | 任务的返回值. 若任务仍在运行中则为 'undefined'               |
| task.error()       | 任务抛出的错误. 若任务仍在运行中则为 'undefined'             |
| task.toPromise     | 一个 Promise, 任务正常返回时调用 resolve, 任务抛出错误时调用 reject |
| task.cancel()      | 取消任务 (如果任务仍在执行中)                                |

#### Channel

channel 是用于在任务间发送和接收消息的对象. 在被感兴趣的接收者请求之前, 来自发送者的消息将被放入 (put) 队列. 在信息可用之前, 已注册的接收者将被放入队列.

每个 channel 都有一个底层 buffer, 这个 buffer 定义了缓存策略 (fixed size, dropping, sliding)

Channel 接口定义了 3 个方法:

##### `channel.take(callback)`

用于注册一个 taker. take 会根据以下规则解析.

1. 如果 channel 有被缓存的消息, 那么将会从底层 buffer 用下一条消息调用 `callback`.
2. 如果 channel 已关闭, 并且没有被缓存的消息, 那将以 `END`为参数调用 `callback`.
3. 否则, 直到有消息被放入 channel 之前, `callback`将被放入队列.

##### `channel.put(message)`

用于在 buffer 上放入消息. 

1. 如果 channel 已经关闭, 那么 put 将没有效果.
2. 如果还有未被处理的 taker, 那将用该 message 调用最老的 taker.
3. 否则将 message 放入底层 buffer.

##### `channel.flush(callback)`

用于从 channel 中提取所有被缓存的消息.

1. 如果 channel 已经被关闭, 并且没有被缓存的消息. 那么将以 `END`为参数调用 `callback`.
2. 否则, 将以所有被缓存的消息为参数调用 `callback`.

#### Buffer

用于为 channel 实现缓存策略.

##### `isEmpty()`

如果缓存中没有消息则返回. 每当注册了新的 taker 时, channel 都会调用该方法.

##### `put(message)`

用于往缓存中放入新的消息. 注意, 缓存可以选择不存储消息.

##### `take()`

用于检索任务被缓存的消息. 此方法的行为必须与 `isEmpty()`一致.

#### SagaMonitor

用于由 middleware  发起监视(monitor)事件.

##### `effectTriggered(options)`

当一个 effect 被触发时 (通过 `yield someEffect`)调用.

options:

| 字段                   | 作用                                               |
| ---------------------- | -------------------------------------------------- |
| effectId: Number       | 分配给 yielded effect 的唯一 ID.                   |
| parentEffectId: Number | 父级 Effect 的 ID.                                 |
| label: String          | 例如 `race(effects)`时, 传递给 effects 对象的标签. |
| effect: Object         | yielded effect 其自身.                             |

##### `effectResolved(effectId, result)`

当 effect 成功被 resolve 时调用.

| 参数名           | 作用                                                         |
| ---------------- | ------------------------------------------------------------ |
| effectId: Number | yielded effect 的 ID                                         |
| result: any      | 该 effect 成功 resolve 的结果. 在 `fork`或 `spawn`的情况下, 结果将是一个 Task 对象 |

##### `effectRejected(effectId, error)`

当 effect 因一个错误被 reject 时调用.

##### `effectCancelled(effectId)`

当 effect 被取消时调用.

##### `actionDispatched(action)`

当 Redux action 被发起时调用.

action 是一个对象, 它就是被发起的 Redux action. 如果该 action 是由一个 saga 发起的, 那么该 action 将拥有一个属性 `SAGA_ACTION`并被设为 true (@@redux-saga/SAGA_ACTION)

### 07-06: 外部 API

#### `runSaga(options, saga, ...args)`

允许在 Redux middleware 环境外部启动 saga.

### 07-07: 工具

#### `channel([buffer])`

用于创建 Channel 的工厂方法.

#### `eventChannel(subscribe, [buffer], [matcher])`

使用 `subscribe`方法创建 channel, 该 channel 将订阅自定义的事件源.

| 参数名              | 作用                                                         |
| ------------------- | ------------------------------------------------------------ |
| subscribe: Function | 用于自定义实现订阅底层的事件源. 这个函数必须返回一个用于结束订阅的 unsubscribe 函数. |
| buffer: Buffer      | 可选的用于该 channel 上的缓存消息. 默认不缓存.               |
| matcher: Function   | 可选的断言函数, 用于过滤传入的消息是否要放到 channel 上.     |

#### `buffers`

提供一些通用的缓存:

##### `buffers.none()`

不缓存. 如果没有尚未处理的 taker, 那么新消息将被丢弃.

##### `buffers.fixed(limit)`

新消息将被缓存, 最多缓存 `limit`条. 溢出时将会报错. 默认 `limit`为 `10`.

##### `buffers.expanding(initialSize)`

与 `fixed`类似, 但溢出时将会动态扩展缓存.

##### `buffers.dropping(limit)`

与 `fixed`类似, 但溢出时将会静默地丢弃消息.

##### `buffers.sliding(limit)`

与 `fixed`类似, 但溢出时会把新消息插到缓存的最尾处, 并丢弃缓存中最老的消息.

#### `delay(ms, [val])`

用于阻塞执行 `ms`毫秒, 并返回 `val`值.

### 07-08: @redux-saga/testing-utils

仅用于测试

#### `cloneableGenerator(generatorFunc)`

返回的 Generator 函数实例化的 generator 都是可以克隆的.

#### `createMockTask()`

返回一个 mock 的 task 对象

### 07-07: (阻塞 / 非阻塞) 速查表

| 名称                 | 阻塞                                            |
| -------------------- | ----------------------------------------------- |
| takeEvery            | 否                                              |
| takeLatest           | 否                                              |
| takeLeading          | 否                                              |
| throttle             | 否                                              |
| take                 | 是                                              |
| take(channel)        | 有时                                            |
| takeMaybe            | 是                                              |
| put                  | 否                                              |
| putResolve           | 是                                              |
| put(channel, action) | 否                                              |
| call                 | 是                                              |
| apply                | 是                                              |
| cps                  | 是                                              |
| fork                 | 否                                              |
| spawn                | 否                                              |
| join                 | 是                                              |
| cancel               | 否                                              |
| select               | 否                                              |
| actionChannel        | 否                                              |
| flush                | 是                                              |
| cancelled            | 是                                              |
| race                 | 是                                              |
| delay                | 是                                              |
| all                  | 当 array 或 object 中有阻塞型 effect 的时候阻塞 |

