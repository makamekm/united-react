"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const browserify_1 = __importDefault(require("browserify"));
const babelify_1 = __importDefault(require("babelify"));
const custom_1 = __importDefault(require("envify/custom"));
const bundler = browserify_1.default({
    entries: ['src/components/demo.tsx'],
    debug: process.env.NODE_ENV === 'production' ? false : true,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    cache: {},
    packageCache: {},
    standalone: 'demo',
});
bundler.transform(babelify_1.default, {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    presets: ['@babel/env', '@babel/react', '@babel/typescript'],
    plugins: [
        'styled-jsx/babel',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true
            }
        ]
    ]
});
bundler.external('react');
if (process.env.NODE_ENV === 'production') {
    bundler.plugin('minifyify', { uglify: true, map: false });
    bundler.transform(custom_1.default({
        NODE_ENV: 'production'
    }));
}
else {
}
function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}
exports.compileComponent = () => streamToString(bundler.bundle());
//# sourceMappingURL=compile-component.js.map