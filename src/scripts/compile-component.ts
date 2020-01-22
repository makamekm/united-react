import browserify from 'browserify';
import babelify from 'babelify';

import { standardLibraries } from '../../scripts/standard-libraries';

function streamToString(stream): Promise<string> {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

export const compileComponent = (path: string = 'demo') => {
  const bundler = browserify({
    entries: [`./demo/components/${path}.tsx`],
    debug: process.env.NODE_ENV === 'production' ? false : true,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    cache: {},
    packageCache: {},
    fullPaths: true,
    standalone: path
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

  bundler.external(standardLibraries);

  return streamToString(bundler.bundle());
};
