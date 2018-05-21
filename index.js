const dt = require('./src/dependency-tree.js')
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
} = require('./src/lib.js')

const defaultConfig = {
  project: process.cwd(),
  sourceDir: `${process.cwd()}/testDir`,
  entryPoints: [
    `${process.cwd()}/testDir/root.js`,
  ],
  alternatePaths: ['src','src/_shared'],
}

const run = (config) => {
  const packageJson = path.join(config.project, 'package.json')
  const packages = extractNpmDependencies(packageJson)

  const resolverConfig = {
    // TODO: move alternatePaths to the config object
    alternatePaths: fromPath(config.project, alternatePaths),
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
    ).then(sort)
}

if (!process.env.TEST) {
  if (process.argv[2]) {
    run(require(path.join(process.cwd(), process.argv[2])))
      .then(filter(excludeIfContains('test')))
      .then(filter(excludeIfContains('.md')))
      .then(filter(excludeIfContains('.princess')))
      .then(filter(excludeIfContains('.scss')))
      .then(filter(excludeIfContains('.svg')))
      .then(filter(excludeIfContains('.png')))
      .then(filter(excludeIfContains('.ttf')))
      .then(filter(excludeIfContains('.woff')))
      .then(filter(excludeIfContains('.woff2')))
      .then(filter(excludeIfContains('.eot')))
      .then(map(debug))
  } else {
    run(defaultConfig)
      .then(filter(excludeIfContains('test')))
      .then(filter(excludeIfContains('.md')))
      .then(filter(excludeIfContains('.princess')))
      .then(filter(excludeIfContains('.scss')))
      .then(filter(excludeIfContains('.svg')))
      .then(filter(excludeIfContains('.png')))
      .then(filter(excludeIfContains('.ttf')))
      .then(filter(excludeIfContains('.woff')))
      .then(filter(excludeIfContains('.woff2')))
      .then(filter(excludeIfContains('.eot')))
      .then(map(debug))
  }
}

module.exports = {
  run,
}
