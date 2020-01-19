import React, { memo } from 'react';
import ReactDOM from 'react-dom';

import paper from 'paper';
import { useSpring, animated, useTransition, UseTransitionResult } from 'react-spring';
import html2canvas from 'html2canvas';
import { View } from '../base/view';

export const LeftPanel = memo(() => {
  const [zoomValue, setZoomValue] = React.useState('100');
  return (
    <>
      <div className="left-panel">
        hello
      </div>
      <style jsx>{`
        .left-panel {
        }
      `}</style>
    </>
  );
});

