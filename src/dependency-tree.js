const acorn = require('acorn/dist/acorn_loose')
const path = require('path')
const walk = require('acorn/dist/walk')
const {
  mapP,
  readFile,
  tryExtensions,
  filterValid,
  debug,
} = require('./lib.js')
const {
  map,
  uniq,
  flatten,
  concat,
  pipeP,
} = require('ramda')

// UTILS
const traverseAndMerge = traverse => list => pipeP(
  mapP(traverse),
  flatten,
  concat(list)
)(list)

// tmp hack
const transpile = code => code.replace(
  /export (.)* from/,
  'import default from'
)

const parse = code => (
  acorn.parse_dammit(
    transpile(code),
    { sourceType: 'module' }
  )
)

const extractImports = code => {
  const imports = []
  walk.simple(
    parse(code),
    {
      ImportDeclaration(n) {
        imports.push(n.source.value)
      },
      CallExpression(n) {
        if (n.callee.name === 'require') {
          imports.push(n.arguments[0].value)
        }
      },
    }
  )
  return imports
}

const resolveFile = (resolver, sources, dependency) =>
  sources.reduce(
    (acc, directory) => {
      return (
        acc || resolver(path.resolve(path.join(directory, dependency)))
      )
    }, false
  )

const isNpm = (cfg, dependency) => cfg.packages.includes(dependency)

const configureResolver =
  (cfg) => module => dependency => {
    const sources = isNpm(cfg, dependency)
      ? []
      : [path.dirname(module)].concat(cfg.alternatePaths)

    return resolveFile(
      tryExtensions(cfg.extensions),
      sources,
      dependency
    )
  }

module.exports = config => {
  const resolver = configureResolver(config)
  const VISITED = {}

  const getDependencies = async file => {
    if (VISITED[file]) { return [] }
    VISITED[file] = true

    return pipeP(
      readFile,
      extractImports,
      map(resolver(file)),
      filterValid,
      traverseAndMerge(getDependencies)
    )(file)
  }

  return entryPoints =>
    Promise.all(entryPoints.map(getDependencies))
      .then(flatten)
      .then(uniq)
      .then(files => files.concat(entryPoints))
}
