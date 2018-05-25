#!/usr/bin/env node
'use strict';

var dt = require('./dependency-tree.js');
var process = require('process');
var path = require('path');
var fs = require('fs');

var _require = require('ramda'),
    map = _require.map,
    reject = _require.reject,
    isNil = _require.isNil,
    concat = _require.concat,
    flatten = _require.flatten,
    filter = _require.filter,
    uniq = _require.uniq;

var _require2 = require('./lib.js'),
    debug = _require2.debug,
    excludeIfContains = _require2.excludeIfContains,
    extractNpmDependencies = _require2.extractNpmDependencies,
    filterValid = _require2.filterValid,
    fromPath = _require2.fromPath,
    readDirDeep = _require2.readDirDeep,
    getFiles = _require2.getFiles,
    readFile = _require2.readFile,
    sort = _require2.sort;

var defaultConfig = {
  project: process.cwd(),
  sourceDir: process.cwd() + '/exampleDir',
  entryPoints: [process.cwd() + '/exampleDir/root.js'],
  alternatePaths: ['src']
};

var run = function run(config) {
  var packageJson = path.join(config.project, 'package.json');
  var packages = extractNpmDependencies(packageJson);

  var filesToExclude = config.filesToExclude || ['.md', '.princess', '.scss', '.eot', '.woff2', '.woff', '.ttf', '.png', '.DS_Store', '.svg'];

  var resolverConfig = {
    alternatePaths: fromPath(config.project, config.alternatePaths),
    packages: Object.keys(packages),
    extensions: ['/index.jsx', '/index.js', '.jsx', '.js', '.json', '.scss', '.css', '']
  };
  var getDependencies = dt(resolverConfig);
  var dependencies = getDependencies(config.entryPoints);
  var allFiles = getFiles(config.sourceDir);

  return Promise.all([dependencies, allFiles]).then(function (finalData) {
    var deps = finalData[0];
    var allFiles = finalData[1];
    var unusedFiles = allFiles.filter(function (file) {
      return !deps.includes(file);
    });

    return unusedFiles;
  }).then(sort).then(filter(excludeIfContains(filesToExclude)));
};

if (!process.env.TEST) {
  if (process.argv[2]) {
    run(require(path.join(process.cwd(), process.argv[2]))).then(map(debug));
  } else {
    var vultureRC = path.join(process.cwd(), '.vulturerc');

    fs.stat(vultureRC, function (err, stat) {
      if (err == null) {
        run(vultureRC).then(map(debug));
      } else if (err.code === 'ENOENT') {
        console.log('no `.vulturerc` found! :(');
      } else {
        console.log('ERROR:', err, code);
      }
    });
  }
}

module.exports = {
  run: run
};