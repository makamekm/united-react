import React, { memo } from 'react';
import ReactDOM from 'react-dom';

import paper from 'paper';
import { useSpring, animated, useTransition, UseTransitionResult } from 'react-spring';
import html2canvas from 'html2canvas';
import { View } from '../base/view';
import { Paper } from './paper';
import { LeftPanel } from './left-panel';

export const IDE = memo(() => {
  return (
    <>
      <div className="ide-layout">
        <div className="ide-layout-mode">
          BBB
        </div>
        <div className="ide-layout-left">
          <LeftPanel />
        </div>
        <div className="ide-layout-paper">
          <Paper />
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
    </>
  );
});

