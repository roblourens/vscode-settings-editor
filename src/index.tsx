import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Editor from './components/Editor';
import CssBaseline from 'material-ui/CssBaseline';
import registerServiceWorker from './registerServiceWorker';

const configuration = require('./configuration_full.json').settings;

ReactDOM.render(
  <div>
    <CssBaseline />
    <Editor settings={configuration} />
  </div>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
