import React, { memo } from 'react';
import ReactDOM from 'react-dom';

import paper from 'paper';
import { animated, useTransition } from 'react-spring';
import html2canvas from 'html2canvas';
import { View } from '../base/view';
import { UmdComponent } from './umd-component';
import { provider } from 'react-ioc';
import { UserService } from '../services/user.service';

function initPaper(canvas: HTMLCanvasElement) {
  canvas.setAttribute('resize', 'true');
  canvas.setAttribute('keepalive', 'true');
  paper.setup(canvas);

  setTimeout(() => {
    const pageWidth = canvas.parentElement.scrollWidth;
    const pageHeight = canvas.parentElement.scrollHeight;
    paper.view.viewSize.width = pageWidth;
    paper.view.viewSize.height = pageHeight;
    const center = new paper.Point(pageWidth / 2, pageHeight / 2);
    paper.view.center = center;
  }, 0);

  const path = new paper.Path();
  path.strokeColor = new paper.Color('black');
  const start = new paper.Point(100, 100);
  path.moveTo(start);
  path.lineTo(start.add(new paper.Point([200, -50])));
  path.selected = true;
}

export const useTimerTransition = (delay: number = 1000, defaultValue?: boolean): [boolean, Function] => {
  const [isOpen, toggle] = React.useState(!!defaultValue);
  let timeout: NodeJS.Timeout;
  const clearTime = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  React.useEffect(() => {
    clearTime();
  }, []);
  const setTimer = () => {
    clearTime();
    timeout = setTimeout(() => toggle(!!defaultValue), delay);
    toggle(!defaultValue);
  };
  return [isOpen, setTimer];
};

export const useZoomIndicator = (): [any, Function] => {
  const [isOpenZoomIndicator, showZoomIndicator] = useTimerTransition();
  const transitions = useTransition(isOpenZoomIndicator, null, {
    from: {
      opacity: 0,
      transform: 'translate3d(0,80px,0)'
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0,0px,0)'
    },
    leave: {
      opacity: 0,
      transform: 'translate3d(0,80px,0)'
    }
  });
  return [transitions, showZoomIndicator];
};

const getZoomValue = () => {
  return (paper.view.zoom * 100).toFixed(0);
};

const maxZoom = 32.0;
const minZoom = 0.01;
const zoomFactor = 1.04;

const rootContainer = services =>
  provider(...services)(({ children }: { children: any }) => {
    return <div>{children}</div>;
  });

async function renderElement(props: React.Props<any> = {}) {
  const element = document.createElement('div');

  // Configuration
  element.style.width = 100 + 'px';
  element.style.height = 200 + 'px';
  const Component = await UmdComponent('/api/compile/component?path=demo', 'demo');
  const RootContainer = rootContainer([UserService]);
  const { ...finalProps } = props;

  ReactDOM.render(
    <RootContainer>
      <Component {...finalProps} />
    </RootContainer>,
    element,
    async () => {
      document.body.appendChild(element);
      try {
        const canvas = await html2canvas(element);
        const raster = new paper.Raster(canvas.toDataURL());
        raster.position = paper.view.center;
        // console.log(canvas.clientWidth, canvas.clientHeight);
        raster.scale(1 / window.devicePixelRatio);
        // raster.shadowColor = new paper.Color(0, 0, 0, 0.5);
        // raster.shadowBlur = 8;
        // raster.shadowOffset = new paper.Point(0, 5);
        // raster.scale(100 / canvas.width);
      } catch (error) {
        console.error(error);
      } finally {
        document.body.removeChild(element);
        ReactDOM.unmountComponentAtNode(element);
      }
    }
  );
}

let renderComponent: () => Promise<void>;

type HotPromise<T> = [Promise<T>, (element: T) => void, (e: any) => void];

function createHotPromise<T = void>(): HotPromise<T> {
  let resolve;
  let reject;
  const promise = new Promise<T>((r, e) => {
    resolve = r;
    reject = e;
  });
  return [promise, resolve, reject];
}

export const ComponentRenderer: React.FC = () => {
  const ref = React.useRef();
  const [data, setData] = React.useState();
  const [promise, setPromise] = React.useState<HotPromise<HTMLElement>>(createHotPromise());
  React.useEffect(() => {
    renderComponent = async () => {
      setData({
        component: await UmdComponent('/api/test', 'demo'),
        props: {}
      });
      const element = await promise[0];
      try {
        const canvas = await html2canvas(element);
        const raster = new paper.Raster(canvas.toDataURL());
        raster.position = paper.view.center;
        raster.scale(1 / window.devicePixelRatio);
      } catch (error) {
        console.error(error);
      } finally {
        setData(null);
      }
    };
  }, [promise]);
  React.useEffect(() => {
    if (data && ref.current) {
      console.log(ref.current);
      promise[1](ref.current);
      setPromise(createHotPromise());
    }
  }, [data, ref]);
  return (
    <>
      {data ? (
        <div ref={ref} style={{ width: '200px', height: '200px' }}>
          <data.component {...data.props}></data.component>
        </div>
      ) : null}
    </>
  );
};

export const Paper = memo(() => {
  React.useEffect(() => {
    initPaper(canvas.current);
    renderElement();
    // renderComponent();
  }, []);

  const [zoomValue, setZoomValue] = React.useState('100');
  const [zoomIndicatorState, showZoomIndicator] = useZoomIndicator();
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const onScroll = React.useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    const native: any = e.nativeEvent;
    const delta = Math.max(-1, Math.min(1, native.wheelDelta || -native.detail));
    const mousePosition = new paper.Point(native.offsetX, native.offsetY);
    const mouseProjection = paper.view.viewToProject(mousePosition);
    let newZoom: number;

    if (delta < 0) {
      newZoom = paper.view.zoom * zoomFactor;
    }
    if (delta > 0) {
      newZoom = paper.view.zoom / zoomFactor;
    }

    if (newZoom < minZoom) {
      newZoom = minZoom;
    } else if (newZoom > maxZoom) {
      newZoom = maxZoom;
    }

    const beta = paper.view.zoom / newZoom;
    mouseProjection.add(new paper.Point(7.5, 7.5));
    const pc = mouseProjection.subtract(paper.view.center);
    const offset = mouseProjection.subtract(pc.multiply(beta)).subtract(paper.view.center);
    paper.view.zoom = newZoom;
    paper.view.center = paper.view.center.add(offset);

    showZoomIndicator();
    setZoomValue(getZoomValue());
  }, []);
  return (
    <>
      <canvas ref={canvas} className="paper" onWheel={onScroll}></canvas>
      {zoomIndicatorState.map(
        ({ item, key, props }) =>
          item && (
            <animated.div className="zoom-indicator" key={key} style={props}>
              {zoomValue}%
            </animated.div>
          )
      )}
      <ComponentRenderer />
      <style jsx>{`
        canvas.paper {
          width: 100%;
          height: 100%;
          min-height: calc(var(--vh) * 100);
        }
      `}</style>
      <style global jsx>{`
        .zoom-indicator {
          position: absolute;
          bottom: 50px;
          left: 50%;
          font-size: 110%;
          background: rgba(0, 0, 0, 0.4);
          color: #ffffff;
          padding: 6px 11px;
          border-radius: 5px;
          transform: translateX(-50%);
        }
      `}</style>
    </>
  );
});
