const path = require('path')
const { fromPath, extractNpmDependencies } = require('./src/lib.js')

const config = {
  sourceDir: '/Users/georgemichael/Code/Procore/vulture',
  entryPoints: [
    '/Users/georgemichael/Code/Procore/vulture/testDir/root.js',
  ],
}

// ASSUMING PROCORE STRUCTURE
const packageJson = path.join(config.sourceDir, 'package.json')
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
