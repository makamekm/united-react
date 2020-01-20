import browserify from 'browserify';
import babelify from 'babelify';
import fs from 'fs';
import watchify from 'watchify';
import envify from 'envify/custom';

const bundler = browserify({
  entries: ['src/components/demo.tsx'],
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

if (process.env.NODE_ENV === 'production') {
  bundler.plugin('minifyify', { uglify: true, map: false });
  bundler.transform(envify({
    NODE_ENV: 'production'
  }));
} else {
  // bundler.plugin(watchify);
}

function streamToString(stream): Promise<string> {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  });
}

export const compileComponent = () => streamToString(bundler.bundle());
