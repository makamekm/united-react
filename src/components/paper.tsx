import React, { memo } from 'react';
import paper from 'paper'

function initPaper(canvas: HTMLCanvasElement) {
  canvas.setAttribute("resize", "true");
  canvas.setAttribute("keepalive", "true");
  paper.setup(canvas);

  const path = new paper.Path();
  path.strokeColor = new paper.Color("black");
  const start = new paper.Point(100, 100);
  path.moveTo(start);
  path.lineTo(start.add(new paper.Point([200, -50])));
  // setInterval(() => {
  //   path.rotate(1);
  // }, 500);
}

export const Paper = memo(() => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    initPaper(canvas.current);
  }, []);
  return (
    <>
      <canvas ref={canvas} className="paper"></canvas>
      <style jsx>{`
        canvas.paper {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
});

