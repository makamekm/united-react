import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IDE } from './components/ide';
import IndexLayout from './layouts/index';

export const App = () => {
  return (
    <>
      <IndexLayout>
        <IDE />
      </IndexLayout>
    </>
  );
};

const element = document.createElement('div');
document.body.appendChild(element);

ReactDOM.render(<App />, element);
