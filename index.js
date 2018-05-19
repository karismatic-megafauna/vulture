const dt = require('./src/dependency-tree.js')
const {
  map,
  concat,
  flatten,
  uniq,
} = require('ramda')
const { debug, filterValid, sort } = require('./src/lib.js')
const {
  resolverConfig,
  config,
} = require('./config.js')

const getDependencies = dt(resolverConfig)

// crawl for dependencies
const dependencies = getDependencies(config.entryPoints)
  .then(sort)

dependencies
  .then(map(debug))
  .then(x => debug(x.length))
