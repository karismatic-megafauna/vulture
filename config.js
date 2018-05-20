const path = require('path')
const process = require('process')
const { map } = require('ramda')
const { fromPath, readFile, extractNpmDependencies, debug } = require('./src/lib.js')

const defaultConfig = {
  project: process.cwd(),
  sourceDir: `${process.cwd()}/testDir`,
  entryPoints: [
    `${process.cwd()}/testDir/root.js`,
  ],
}

const setup = (conf = defaultConfig) => {
  return conf;
}

const configFile = require(path.join(process.cwd(), process.argv[2]))
const config = setup(configFile);

// ASSUMING PROCORE STRUCTURE
const packageJson = path.join(config.project, 'package.json')
const packages = extractNpmDependencies(packageJson)

const resolverConfig = {
  packages: Object.keys(packages),
  extensions: [
    '/index.jsx',
    '/index.js',
    '.jsx',
    '.js',
    '.scss',
    '.css',
    '', // in case the extension is already provided
  ],
}

module.exports = {
  setup,
  config,
  resolverConfig,
}
