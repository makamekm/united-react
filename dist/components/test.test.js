"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const renderer = require("react-test-renderer");
it('div renders correctly', () => {
    const tree = renderer.create(<div>Hello World</div>).toJSON();
    expect(tree).toMatchSnapshot();
});
//# sourceMappingURL=test.test.js.map