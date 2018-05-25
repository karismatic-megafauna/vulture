'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var fs = require('fs-extra');
var fsPromise = require('fs-promise');
var readdir = fsPromise.readdir,
    stat = fsPromise.stat;

var _require = require('ramda'),
    filter = _require.filter;

// UTILS


var taskDone = function taskDone(task) {
  return console.log('taskDone:', task);
};
var mapP = function mapP(mapFunction) {
  return function (list) {
    return Promise.all(list.map(mapFunction));
  };
};
var filterValid = filter(function (x) {
  return x;
});
var debug = function debug(x) {
  console.log(JSON.stringify(x, null, 2));
  return x;
};

var excludeIfContains = function excludeIfContains(exclusionArry) {
  return function (path) {
    var containsExclusion = exclusionArry.find(function (exclusion) {
      return path.includes(exclusion);
    });

    return containsExclusion ? null : path;
  };
};

var sort = function sort(list) {
  return list.sort();
};

// FILE UTILS
var fromPath = function fromPath(dir, sources) {
  return sources.map(function (file) {
    return path.join(dir, file);
  });
};
var getAbsolutePathFromfile = function getAbsolutePathFromfile(file) {
  return function (relativePath) {
    return path.resolve(path.join(path.dirname(file), relativePath));
  };
};

var tryFile = function tryFile(file) {
  try {
    return fs.existsSync(file) && file;
  } catch (e) {
    return undefined;
  }
};

var tryExtensions = function tryExtensions(extensions) {
  return function (file) {
    return extensions.reduce(function (acc, ext) {
      return acc ? acc : tryFile(file + ext);
    }, undefined);
  };
};

var readDirDeep = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(dir) {
    var allFiles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var files;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return readdir(dir);

          case 2:
            _context2.t0 = function (f) {
              return path.join(dir, f);
            };

            files = _context2.sent.map(_context2.t0);

            allFiles.push.apply(allFiles, (0, _toConsumableArray3.default)(files));
            _context2.next = 7;
            return Promise.all(files.map(function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(f) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return stat(f);

                      case 2:
                        _context.t0 = _context.sent.isDirectory();

                        if (!_context.t0) {
                          _context.next = 5;
                          break;
                        }

                        _context.t0 = readDirDeep(f, allFiles);

                      case 5:
                        return _context.abrupt('return', _context.t0);

                      case 6:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 7:
            return _context2.abrupt('return', allFiles);

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function readDirDeep(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getFiles = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(dir) {
    var subdirs, files;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return readdir(dir);

          case 2:
            subdirs = _context4.sent;
            _context4.next = 5;
            return Promise.all(subdirs.map(function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(subdir) {
                var res;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        res = path.resolve(dir, subdir);
                        _context3.next = 3;
                        return stat(res);

                      case 3:
                        if (!_context3.sent.isDirectory()) {
                          _context3.next = 7;
                          break;
                        }

                        _context3.t0 = getFiles(res);
                        _context3.next = 8;
                        break;

                      case 7:
                        _context3.t0 = res;

                      case 8:
                        return _context3.abrupt('return', _context3.t0);

                      case 9:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x5) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 5:
            files = _context4.sent;
            return _context4.abrupt('return', files.reduce(function (a, f) {
              return a.concat(f);
            }, []));

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function getFiles(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var readFile = function readFile(file) {
  return new Promise(function (resolve, reject) {
    fs.lstat(file, function (err, stats) {
      if (err) {
        reject(err);
        return;
      }
      if (stats.isDirectory()) {
        return;
      }
      if (stats.isFile()) {
        fs.readFile(file, 'utf-8', function (readError, content) {
          if (readError) {
            reject(readError);
            return;
          }
          resolve(content);
        });
      }
    });
  });
};

// PACKAGE.JSON UTILS
var extractNpmDependencies = function extractNpmDependencies(packageJson) {
  var packageConfig = require(packageJson);
  return packageConfig.dependencies;
};

module.exports = {
  debug: debug,
  excludeIfContains: excludeIfContains,
  extractNpmDependencies: extractNpmDependencies,
  fromPath: fromPath,
  filterValid: filterValid,
  getAbsolutePathFromfile: getAbsolutePathFromfile,
  getDir: path.dirname,
  mapP: mapP,
  readFile: readFile,
  readDirDeep: readDirDeep,
  getFiles: getFiles,
  taskDone: taskDone,
  tryExtensions: tryExtensions,
  tryFile: tryFile,
  sort: sort
};