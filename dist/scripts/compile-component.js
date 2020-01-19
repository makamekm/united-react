"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browserify_1 = require("browserify");
const babelify_1 = require("babelify");
const fs_1 = require("fs");
const watchify_1 = require("watchify");
const custom_1 = require("envify/custom");
const bundler = browserify_1.default({
    entries: ['src/popup/index.tsx'],
    debug: process.env.NODE_ENV === 'production' ? false : true,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    cache: {},
    packageCache: {}
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
if (process.env.NODE_ENV === 'production') {
    bundler.plugin('minifyify', { uglify: true, map: false });
}
else {
    bundler.plugin(watchify_1.default);
    bundler.transform(custom_1.default({
        NODE_ENV: 'development'
    }));
}
bundler.bundle().pipe(fs_1.default.createWriteStream('public/components/demo.js', { flags: 'w' }));
//# sourceMappingURL=compile-component.js.map