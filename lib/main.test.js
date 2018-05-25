'use strict';

var _require = require('./main.js'),
    run = _require.run;

test('index test', function () {
  var defaultConfig = {
    project: process.cwd(),
    sourceDir: process.cwd() + '/testDir',
    alternatePaths: ['src'],
    entryPoints: [process.cwd() + '/testDir/root.js']
  };

  var result = [defaultConfig.sourceDir + '/anotherNestedDir/unused.js', defaultConfig.sourceDir + '/nestedDir/unused.js', defaultConfig.sourceDir + '/siblingUnused.js', defaultConfig.sourceDir + '/unused.js', defaultConfig.sourceDir + '/unusedWithImports.js'].sort();

  expect.assertions(1);
  return expect(run(defaultConfig)).resolves.toEqual(result);
});