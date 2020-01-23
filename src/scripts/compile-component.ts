import browserify from 'browserify';
import babelify from 'babelify';
import path from 'path';
import glob from 'glob';

import { standardLibraries } from '../../scripts/standard-libraries';
import { getServiceList } from './compile-service';

function streamToString(stream): Promise<string> {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

export const getComponentList = async () => {
  return await new Promise((r, e) =>
    glob(
      path.resolve('./demo/components') + '/**/*',
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

export const compileComponent = async (componentPath: string) => {
  const bundler = browserify({
    entries: [path.resolve(`./demo/components/${componentPath}.tsx`)],
    debug: process.env.NODE_ENV === 'production' ? false : true,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    cache: {},
    packageCache: {},
    fullPaths: true,
    standalone: componentPath,
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
  const paths = await getServiceList();
  bundler.external(paths);

  return streamToString(bundler.bundle());
  // const res = await streamToString(bundler.bundle());
  // return res.replace(/\".*\/services\/.*\"/gim, `"${path.resolve('./demo')}/services/`);
};
