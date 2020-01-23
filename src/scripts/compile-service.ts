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

export const getServiceList = async (): Promise<string[]> => {
  return await new Promise<string[]>((r, e) =>
    glob(
      path.resolve('./demo/services') + '/**/*',
      {
        nodir: true
      },
      (er, files) => {
        if (!er) {
          r(files);
        } else {
          e(er);
        }
      }
    )
  );
};

export const compileServices = async () => {
  const paths = await getServiceList();

  const bundler = browserify({
    files: paths,
    entries: paths,
    debug: process.env.NODE_ENV === 'production' ? false : true,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    cache: {},
    packageCache: {},
    fullPaths: true,
    require: paths,
    basedir: '/',
    paths: [path.resolve(`./demo/node_modules`), path.resolve(`./node_modules`)]
  });

  bundler.transform(babelify, {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    presets: [
      path.resolve(`./node_modules`, '@babel/preset-env'),
      path.resolve(`./node_modules`, '@babel/preset-react'),
      path.resolve(`./node_modules`, '@babel/preset-typescript')
    ],
    plugins: [
      path.resolve(`./node_modules`, 'styled-jsx/babel'),
      [
        path.resolve(`./node_modules`, '@babel/plugin-proposal-decorators'),
        {
          legacy: true
        }
      ],
      [path.resolve(`./node_modules`, '@babel/plugin-proposal-class-properties'), { loose: true }]
    ]
  });

  bundler.external(standardLibraries);

  return streamToString(bundler.bundle());
};
