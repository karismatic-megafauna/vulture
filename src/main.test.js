const { run } = require('./main.js');

describe('vulture', () => {
  test('finds all the unused files', () => {
    const defaultConfig = {
      project: process.cwd(),
      sourceDir: `${process.cwd()}/exampleDir`,
      alternatePaths: ['src'],
      entryPoints: [
        `${process.cwd()}/exampleDir/root.js`,
      ],
      filesToExclude: [],
    }

    const result = [
      `${defaultConfig.sourceDir}/anotherNestedDir/unused.js`,
      `${defaultConfig.sourceDir}/nestedDir/unused.js`,
      `${defaultConfig.sourceDir}/siblingUnused.js`,
      `${defaultConfig.sourceDir}/unused.js`,
      `${defaultConfig.sourceDir}/unused.DS_Store.js`,
      `${defaultConfig.sourceDir}/unusedWithImports.js`,
    ].sort()

    expect.assertions(1);
    return expect(run(defaultConfig)).resolves.toEqual(result)
  });

  test('Excludes all the correct files', () => {
    const defaultConfig = {
      project: process.cwd(),
      sourceDir: `${process.cwd()}/exampleDir`,
      alternatePaths: ['src'],
      entryPoints: [
        `${process.cwd()}/exampleDir/root.js`,
      ],
      filesToExclude: ['.DS_Store'],
    }

    const result = [
      `${defaultConfig.sourceDir}/anotherNestedDir/unused.js`,
      `${defaultConfig.sourceDir}/nestedDir/unused.js`,
      `${defaultConfig.sourceDir}/siblingUnused.js`,
      `${defaultConfig.sourceDir}/unused.js`,
      `${defaultConfig.sourceDir}/unusedWithImports.js`,
    ].sort()

    expect.assertions(1);
    return expect(run(defaultConfig)).resolves.toEqual(result)
  });
});
