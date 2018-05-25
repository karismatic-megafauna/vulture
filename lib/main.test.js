'use strict';

var _require = require('./main.js'),
    run = _require.run;

describe('vulture', function () {
  test('finds all the unused files', function () {
    var defaultConfig = {
      project: process.cwd(),
      sourceDir: process.cwd() + '/exampleDir',
      alternatePaths: ['src'],
      entryPoints: [process.cwd() + '/exampleDir/root.js'],
      filesToExclude: []
    };

    var result = [defaultConfig.sourceDir + '/anotherNestedDir/unused.js', defaultConfig.sourceDir + '/nestedDir/unused.js', defaultConfig.sourceDir + '/siblingUnused.js', defaultConfig.sourceDir + '/unused.js', defaultConfig.sourceDir + '/unused.DS_Store.js', defaultConfig.sourceDir + '/unusedWithImports.js'].sort();

    expect.assertions(1);
    return expect(run(defaultConfig)).resolves.toEqual(result);
  });

  test('Excludes all the correct files', function () {
    var defaultConfig = {
      project: process.cwd(),
      sourceDir: process.cwd() + '/exampleDir',
      alternatePaths: ['src'],
      entryPoints: [process.cwd() + '/exampleDir/root.js'],
      filesToExclude: ['.DS_Store']
    };

    var result = [defaultConfig.sourceDir + '/anotherNestedDir/unused.js', defaultConfig.sourceDir + '/nestedDir/unused.js', defaultConfig.sourceDir + '/siblingUnused.js', defaultConfig.sourceDir + '/unused.js', defaultConfig.sourceDir + '/unusedWithImports.js'].sort();

    expect.assertions(1);
    return expect(run(defaultConfig)).resolves.toEqual(result);
  });
});