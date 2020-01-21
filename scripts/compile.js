const browserify = require('browserify');
const babelify = require('babelify');
const fs = require('fs');
const watchify = require('watchify');
const envify = require('envify/custom');

const bundler = browserify({
  entries: ['src/index.tsx'],
  debug: process.env.NODE_ENV === 'production' ? false : true,
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  cache: {},
  packageCache: {},
  standalone: 'demo',
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

// bundler.external('react');

if (process.env.NODE_ENV === 'production') {
  bundler.plugin('minifyify', { uglify: true, map: false });
  bundler.transform(envify({
    NODE_ENV: 'production'
  }));
} else {
  // bundler.plugin(watchify);
}

bundler.bundle().pipe(fs.createWriteStream('public/index.js', { flags: 'w' }));
