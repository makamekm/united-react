import browserify from 'browserify';
import babelify from 'babelify';
import path from 'path';
import glob from 'glob';

import { standardLibraries } from '../../scripts/standard-libraries';

function streamToString(stream): Promise<string> {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

export const compileService = async (servicePath: string) => {
  const bundler = browserify({
    entries: [`./demo/services/${servicePath}.tsx`],
    debug: process.env.NODE_ENV === 'production' ? false : true,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    cache: {},
    packageCache: {},
    fullPaths: true,
    standalone: servicePath
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
  const paths = await new Promise((r, e) => glob(path.resolve('./demo/services') + '/**/*', {}, (er, files) => {
    if (!er) {
      r(files);
    } else {
      e(er);
    }
  }));
  bundler.external(paths);

  return streamToString(bundler.bundle());
};
