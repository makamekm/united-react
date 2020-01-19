"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_ioc_1 = require("react-ioc");
const root_services_dict_1 = require("./root.services.dict");
const updateVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};
exports.useRootHook = (props) => {
    React.useEffect(() => {
        updateVH();
        window.addEventListener('resize', updateVH);
        return () => window.removeEventListener('resize', updateVH);
    }, []);
    const instances = root_services_dict_1.services.map(service => react_ioc_1.useInstance(service));
    let loading = false;
    instances.forEach(instance => {
        if (instance.useHook) {
            instance.useHook(props);
            loading = loading || instance.loading;
        }
    });
    return loading;
};
//# sourceMappingURL=root.js.map