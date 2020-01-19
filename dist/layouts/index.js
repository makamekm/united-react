"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_helmet_1 = require("react-helmet");
const react_ioc_1 = require("react-ioc");
const mobx_react_1 = require("mobx-react");
const loading_1 = require("../components/loading");
const root_1 = require("../libs/root");
const root_services_dict_1 = require("../libs/root.services.dict");
const IndexLayout = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    const loading = root_1.useRootHook(props);
    return (<>
      <react_helmet_1.default title="App Name" meta={[{ name: 'description', content: 'Desctiption' }, { name: 'keywords', content: 'keyword' }]}/>
      {children}
      <loading_1.default active={loading}/>
      <style global jsx>{`
        body {
          padding: 0;
          margin: 0;
          font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, Helvetica, sans-serif;
          background-color: rgb(238, 238, 238);
          color: #4a4a4a;
          max-width: 100vw;
          min-width: 100vw;
          overflow: hidden;
        }

        body, #___gatsby, #gatsby-focus-wrapper {
          min-height: calc(var(--vh) * 100);
        }
      `}</style>
    </>);
};
exports.default = react_ioc_1.provider(...root_services_dict_1.services)(mobx_react_1.observer(IndexLayout));
//# sourceMappingURL=index.js.map