const path = require('path')
const { fromPath, extractNpmDependencies } = require('./src/lib.js')

const config = {
  project: '/Users/georgemichael/Code/Procore/vulture',
  sourceDir: '/Users/georgemichael/Code/Procore/vulture/testDir',
  entryPoints: [
    '/Users/georgemichael/Code/Procore/vulture/testDir/root.js',
  ],
}

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
  config,
  resolverConfig,
}
