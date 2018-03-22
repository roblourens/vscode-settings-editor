import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Editor from './components/Editor';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const configuration = require('./configuration.json').settings;

ReactDOM.render(
  <Editor configuration={configuration} />,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
