import * as React from 'react';
import * as renderer from 'react-test-renderer';

it('div renders correctly', () => {
  const tree = renderer.create(<div>Hello World</div>).toJSON();
  expect(tree).toMatchSnapshot();
});
