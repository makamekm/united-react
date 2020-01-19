"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const classnames_1 = require("classnames");
exports.View = react_1.memo(({ children, className, color, style }) => {
    return (<div className={classnames_1.default('panel', className)} style={style}>
      Test
      {children}

      <style jsx>{`
        .panel {
          padding: 20px;
          background-color: ${color || 'tomato'};
          color: white;
          font-weight: 800;
          border-radius: 5px;
          text-shadow: 2px 4px 0px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>);
});
//# sourceMappingURL=view.js.map