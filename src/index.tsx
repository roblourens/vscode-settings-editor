import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import CssBaseline from 'material-ui/CssBaseline';

import registerServiceWorker from './registerServiceWorker';
import store, { history } from './store';

import SearchableSettings from './components/Editor';
import Header from './components/Header';

const target = document.querySelector('#root');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <CssBaseline />
        <Header />
        <SearchableSettings />
      </div>
    </ConnectedRouter>
  </Provider>,
  target
);