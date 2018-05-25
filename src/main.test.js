const { run } = require('./main.js');

test('index test', () => {
  const defaultConfig = {
    project: process.cwd(),
    sourceDir: `${process.cwd()}/exampleDir`,
    alternatePaths: ['src'],
    entryPoints: [
      `${process.cwd()}/exampleDir/root.js`,
    ],
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
