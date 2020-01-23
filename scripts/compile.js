const browserify = require('browserify');
const babelify = require('babelify');
const fs = require('fs');
const watchify = require('watchify');
const envify = require('envify/custom');
const path = require('path');
const { standardLibraries } = require('./standard-libraries');

const bundler = browserify({
  entries: ['src/index.tsx'],
  debug: process.env.NODE_ENV === 'production' ? false : true,
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  cache: {},
  packageCache: {},
  fullPaths: true,
  require: standardLibraries
});

bundler.transform(babelify, {
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  presets: ['@babel/env', '@babel/react', '@babel/typescript'],
  plugins: [
    'styled-jsx/babel',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
});

const bundle = () => bundler.bundle().pipe(fs.createWriteStream('public/index.js', { flags: 'w' }));

if (process.env.NODE_ENV === 'production') {
  bundler.transform(
    {
      global: true
    },
    envify({
      NODE_ENV: 'production'
    })
  );
  bundler.plugin('minifyify', { uglify: true, map: false });
} else {
  bundler.plugin(watchify);
  bundler.on('update', bundle);
}

bundle();

copyFolderRecursiveSync('./static', './public');

function copyFileSync(source, target) {
  var targetFile = target;

  // if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  var files = [];

  //check if folder needs to be created or integrated
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  //copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function(file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, path.join(target, file));
      } else {
        copyFileSync(curSource, target);
      }
    });
  }
}
