#!/usr/bin/env node
const dt = require('./dependency-tree.js')
const process = require('process')
const path = require('path')
const {
  map,
  reject,
  isNil,
  concat,
  flatten,
  filter,
  uniq,
} = require('ramda')
const {
  debug,
  excludeIfContains,
  extractNpmDependencies,
  filterValid,
  fromPath,
  readDirDeep,
  getFiles,
  readFile,
  sort,
} = require('./lib.js')

const defaultConfig = {
  project: process.cwd(),
  sourceDir: `${process.cwd()}/exampleDir`,
  entryPoints: [
    `${process.cwd()}/exampleDir/root.js`,
  ],
  alternatePaths: ['src'],
}

const run = (config) => {
  const packageJson = path.join(config.project, 'package.json')
  const packages = extractNpmDependencies(packageJson)

  const filesToExclude = config.filesToExclude || [
    '.md',
    '.princess',
    '.scss',
    '.eot',
    '.woff2',
    '.woff',
    '.ttf',
    '.png',
    '.DS_Store',
    '.svg',
  ];

  const resolverConfig = {
    alternatePaths: fromPath(config.project, config.alternatePaths),
    packages: Object.keys(packages),
    extensions: [
      '/index.jsx',
      '/index.js',
      '.jsx',
      '.js',
      '.json',
      '.scss',
      '.css',
      '', // in case the extension is already provided
    ],
  }
  const getDependencies = dt(resolverConfig)
  const dependencies = getDependencies(config.entryPoints)
  const allFiles = getFiles(config.sourceDir)

  return Promise.all([dependencies, allFiles])
    .then(
      finalData => {
        const deps = finalData[0];
        const allFiles = finalData[1];
        const unusedFiles = allFiles.filter(file => !deps.includes(file))

        return unusedFiles
      }
    )
    .then(sort)
    .then(filter(excludeIfContains(filesToExclude)))
}


if (!process.env.TEST) {
  if (process.argv[2]) {
    run(require(path.join(process.cwd(), process.argv[2])))
      .then(map(debug))
  } else {
    run(defaultConfig)
      .then(map(debug))
  }
}

module.exports = {
  run,
}
