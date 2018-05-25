'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var acorn = require('acorn/dist/acorn_loose');
var path = require('path');
var walk = require('acorn/dist/walk');

var _require = require('./lib.js'),
    mapP = _require.mapP,
    readFile = _require.readFile,
    tryExtensions = _require.tryExtensions,
    filterValid = _require.filterValid,
    debug = _require.debug;

var _require2 = require('ramda'),
    map = _require2.map,
    uniq = _require2.uniq,
    flatten = _require2.flatten,
    concat = _require2.concat,
    pipeP = _require2.pipeP;

// UTILS


var traverseAndMerge = function traverseAndMerge(traverse) {
  return function (list) {
    return pipeP(mapP(traverse), flatten, concat(list))(list);
  };
};

// tmp hack
var transpile = function transpile(code) {
  return code.replace(/export (.)* from/, 'import default from');
};

var parse = function parse(code) {
  return acorn.parse_dammit(transpile(code), { sourceType: 'module' });
};

var extractImports = function extractImports(code) {
  var imports = [];
  walk.simple(parse(code), {
    ImportDeclaration: function ImportDeclaration(n) {
      imports.push(n.source.value);
    },
    CallExpression: function CallExpression(n) {
      if (n.callee.name === 'require') {
        imports.push(n.arguments[0].value);
      }
    }
  });
  return imports;
};

var resolveFile = function resolveFile(resolver, sources, dependency) {
  return sources.reduce(function (acc, directory) {
    return acc || resolver(path.resolve(path.join(directory, dependency)));
  }, false);
};

var isNpm = function isNpm(cfg, dependency) {
  return cfg.packages.includes(dependency);
};

var configureResolver = function configureResolver(cfg) {
  return function (module) {
    return function (dependency) {
      var sources = isNpm(cfg, dependency) ? [] : [path.dirname(module)].concat(cfg.alternatePaths);

      return resolveFile(tryExtensions(cfg.extensions), sources, dependency);
    };
  };
};

module.exports = function (config) {
  var resolver = configureResolver(config);
  var VISITED = {};

  var getDependencies = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(file) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!VISITED[file]) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', []);

            case 2:
              VISITED[file] = true;

              return _context.abrupt('return', pipeP(readFile, extractImports, map(resolver(file)), filterValid, traverseAndMerge(getDependencies))(file));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function getDependencies(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  return function (entryPoints) {
    return Promise.all(entryPoints.map(getDependencies)).then(flatten).then(uniq).then(function (files) {
      return files.concat(entryPoints);
    });
  };
};