import { Route, Switch, Link } from 'react-router-dom';

const context = require.context('./pages', true, /index\.jsx$/);
const keys = context.keys();

import Page0101 from './pages/01-01/index';

const list = [{ name: '/01-01', c: Page0101 }];

function renderLinks() {
  return keys.map((key) => {
    const arr = key.split('/');
    return (
      <>
        <Link to={'/' + arr[1]}>{arr[1]}</Link>
        <div
          style={{
            margin: '5px',
          }}
        >
          |
        </div>
      </>
    );
  });
  // return list.map((c) => (
  //   <>
  //     <Link to={c.name}>{c.name}</Link>
  //     <br />
  //   </>
  // ));
}

function renderRoute() {
  // return list.map((c) => <Route path={c.name} exact component={c.c} />);
  return keys.map((key) => {
    const arr = key.split('/');
    return (
      //
      <Route path={'/' + arr[1]} exact component={context(key).default} />
    );
  });
}

export default () => (
  <div>
    <div>
      <h1>Link</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {renderLinks()}
      </div>
    </div>
    <hr />
    <div>
      <h1>Route</h1>
      <Switch>{renderRoute()}</Switch>
    </div>
  </div>
);
