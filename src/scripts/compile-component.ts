import browserify from 'browserify';
import babelify from 'babelify';
import fs from 'fs';
import watchify from 'watchify';
import envify from 'envify/custom';

const bundler = browserify({
  entries: ['src/popup/index.tsx'],
  debug: process.env.NODE_ENV === 'production' ? false : true,
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  cache: {},
  packageCache: {}
});

bundler.transform(babelify, {
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
} else {
  bundler.plugin(watchify);
  bundler.transform(envify({
    NODE_ENV: 'development'
  }))
}

bundler.bundle().pipe(fs.createWriteStream('public/components/demo.js', { flags: 'w' }));
