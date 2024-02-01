export default function ({
  value,
  onIncrement,
  onDecrement,
  onIncrementAsync,
  onRandom
}) {
  return (
    <div>
      <button onClick={onIncrementAsync}>Increment after 1 second</button>{' '}
      <button onClick={onIncrement}>Increment</button>{' '}
      <button onClick={onDecrement}>Decrement</button>{' '}
      <button onClick={onRandom}>Random</button>
      <hr />
      <div>Clicked: {value} times</div>
    </div>
  );
}
