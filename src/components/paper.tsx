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


  setInterval(() => {
    // path.rotate(1);

    // if (bounds.x < 0) paper.view.center = paper.view.center.subtract(new paper.Point(bounds.x, 0));
    // if (bounds.y < 0) paper.view.center = paper.view.center.subtract(new paper.Point(0, bounds.y));

    // const w = bounds.x + bounds.width;
    // const h = bounds.y + bounds.height;

    // if (w > paper.view.viewSize.width) {
    //   paper.view.center = paper.view.center.subtract(new paper.Point(w - paper.view.viewSize.width, 0));
    // }
    // if (h > paper.view.viewSize.height) {
    //   paper.view.center = paper.view.center.subtract(new paper.Point(0, h - paper.view.viewSize.height));
    // }

  }, 2000);
}

function changeZoom(oldZoom, delta, c, p) {
  let newZoom;
  const factor = 1.025;
  if (delta < 0) {
    newZoom = oldZoom * factor;
  }
  if (delta > 0) {
    newZoom = oldZoom / factor;
  }
  const beta = oldZoom / newZoom;
  p.add(new paper.Point(7.5, 7.5));
  const pc = p.subtract(c);
  const offset = p.subtract(pc.multiply(beta)).subtract(c);
  paper.view.zoom = newZoom;
  paper.view.center = paper.view.center.add(offset);
};

export const Paper = memo(() => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const onScroll = React.useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    const native: any = e.nativeEvent;
    const delta = Math.max(-1, Math.min(1, (native.wheelDelta || -native.detail)));
    const mousePosition = new paper.Point(native.offsetX, native.offsetY);
    changeZoom(paper.view.zoom, delta, paper.view.center, paper.view.viewToProject(mousePosition));
  }, []);
  React.useEffect(() => {
    initPaper(canvas.current);
  }, []);
  return (
    <>
      <canvas ref={canvas} className="paper" onWheel={onScroll}></canvas>
      <style jsx>{`
        canvas.paper {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
});

