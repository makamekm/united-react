"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const paper_1 = require("paper");
const react_spring_1 = require("react-spring");
const html2canvas_1 = require("html2canvas");
const view_1 = require("../base/view");
function initPaper(canvas) {
    canvas.setAttribute("resize", "true");
    canvas.setAttribute("keepalive", "true");
    paper_1.default.setup(canvas);
    const path = new paper_1.default.Path();
    path.strokeColor = new paper_1.default.Color("black");
    const start = new paper_1.default.Point(100, 100);
    path.moveTo(start);
    path.lineTo(start.add(new paper_1.default.Point([200, -50])));
    path.selected = true;
}
exports.useTimerTransition = (delay = 1000, defaultValue) => {
    const [isOpen, toggle] = react_1.default.useState(!!defaultValue);
    let timeout;
    const clearTime = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    react_1.default.useEffect(() => {
        clearTime();
    }, []);
    const setTimer = () => {
        clearTime();
        timeout = setTimeout(() => toggle(!!defaultValue), delay);
        toggle(!defaultValue);
    };
    return [isOpen, setTimer];
};
exports.useZoomIndicator = () => {
    const [isOpenZoomIndicator, showZoomIndicator] = exports.useTimerTransition();
    const transitions = react_spring_1.useTransition(isOpenZoomIndicator, null, {
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
        },
    });
    return [transitions, showZoomIndicator];
};
const getZoomValue = () => {
    return (paper_1.default.view.zoom * 100).toFixed(0);
};
const maxZoom = 32.00;
const minZoom = 0.01;
const zoomFactor = 1.04;
function renderElement(jsxComponent, props) {
    const element = document.createElement("div");
    element.style.width = 100 + "px";
    element.style.height = 200 + "px";
    react_dom_1.default.render(react_1.default.createElement(jsxComponent, props), element, async () => {
        document.body.appendChild(element);
        try {
            const canvas = await html2canvas_1.default(element);
            const raster = new paper_1.default.Raster(canvas.toDataURL());
            raster.position = paper_1.default.view.center;
            raster.scale(1 / window.devicePixelRatio);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            document.body.removeChild(element);
            react_dom_1.default.unmountComponentAtNode(element);
        }
    });
}
exports.Paper = react_1.memo(() => {
    react_1.default.useEffect(() => {
        initPaper(canvas.current);
        renderElement(view_1.View, {});
    }, []);
    const [zoomValue, setZoomValue] = react_1.default.useState('100');
    const [zoomIndicatorState, showZoomIndicator] = exports.useZoomIndicator();
    const canvas = react_1.default.useRef(null);
    const onScroll = react_1.default.useCallback((e) => {
        const native = e.nativeEvent;
        const delta = Math.max(-1, Math.min(1, (native.wheelDelta || -native.detail)));
        const mousePosition = new paper_1.default.Point(native.offsetX, native.offsetY);
        const mouseProjection = paper_1.default.view.viewToProject(mousePosition);
        let newZoom;
        if (delta < 0) {
            newZoom = paper_1.default.view.zoom * zoomFactor;
        }
        if (delta > 0) {
            newZoom = paper_1.default.view.zoom / zoomFactor;
        }
        if (newZoom < minZoom) {
            newZoom = minZoom;
        }
        else if (newZoom > maxZoom) {
            newZoom = maxZoom;
        }
        const beta = paper_1.default.view.zoom / newZoom;
        mouseProjection.add(new paper_1.default.Point(7.5, 7.5));
        const pc = mouseProjection.subtract(paper_1.default.view.center);
        const offset = mouseProjection.subtract(pc.multiply(beta)).subtract(paper_1.default.view.center);
        paper_1.default.view.zoom = newZoom;
        paper_1.default.view.center = paper_1.default.view.center.add(offset);
        showZoomIndicator();
        setZoomValue(getZoomValue());
    }, []);
    return (<>
      <canvas ref={canvas} className="paper" onWheel={onScroll}></canvas>
      {zoomIndicatorState.map(({ item, key, props }) => item && <react_spring_1.animated.div className="zoom-indicator" key={key} style={props}>{zoomValue}%</react_spring_1.animated.div>)}
      <style jsx>{`
        canvas.paper {
          width: 100%;
          height: 100%;
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
    </>);
});
//# sourceMappingURL=paper.js.map