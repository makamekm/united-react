"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const paper_1 = require("./paper");
const left_panel_1 = require("./left-panel");
exports.IDE = react_1.memo(() => {
    return (<>
      <div className="ide-layout">
        <div className="ide-layout-mode">
          BBB
        </div>
        <div className="ide-layout-left">
          <left_panel_1.LeftPanel />
        </div>
        <div className="ide-layout-paper">
          <paper_1.Paper />
        </div>
        <div className="ide-layout-right">
          HHH
        </div>
      </div>
      <style jsx>{`
        .ide-layout {
          display: flex;
          flex-flow: row;
          justify-content: stretch;
          align-items: stretch;
          width: 100%;
          height: calc(var(--vh) * 100);
        }

        .ide-layout-paper {
          flex: 1;
          position: relative;
        }

        .ide-layout-left {
          width: 225px;
          background-color: #fff;
          border-right: 1px solid #ddd;
        }

        .ide-layout-mode {
          width: 50px;
          background-color: #fff;
          border-right: 1px solid #ddd;
        }

        .ide-layout-right {
          background-color: #fff;
          border-left: 1px solid #ddd;
        }
      `}</style>
    </>);
});
//# sourceMappingURL=ide.js.map