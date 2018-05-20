const dt = require('./src/dependency-tree.js')
const path = require('path')
const {
  map,
  concat,
  flatten,
  uniq,
} = require('ramda')
const { debug, filterValid, sort, readDirDeep } = require('./src/lib.js')
const {
  resolverConfig,
  config,
} = require('./config.js')

const getDependencies = dt(resolverConfig)

// crawl for dependencies
const dependencies = getDependencies(config.entryPoints)
  .then(sort)

const allFiles = readDirDeep(config.sourceDir);

Promise.all([dependencies, allFiles])
  .then(finalData => {
    const deps = finalData[0];
    const allFiles = finalData[1];
    const unusedFiles = allFiles.filter(file => !deps.includes(file))

    return unusedFiles
  })
  .then(map(debug))
  .then(x => debug(x.length))
