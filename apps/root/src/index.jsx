import { Desktop } from '@monorepo/desktop';
import React from 'react';
import { render } from 'react-dom';

export const Root = () => {
  return (
    <div>
      <Desktop />
    </div>
  );
};

render(<Root />, document.querySelector('#root'));
