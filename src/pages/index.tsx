import * as React from 'react';
import { observer } from 'mobx-react';
import { Paper } from '../components/paper';
import { IDE } from '../components/ide';

export default observer(() => {
  return (
    <>
      <IDE />
    </>
  );
});
