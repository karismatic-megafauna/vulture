const { run } = require('./index.js');


test('index test', () => {
  const defaultConfig = {
    project: process.cwd(),
    sourceDir: `${process.cwd()}/testDir`,
    entryPoints: [
      `${process.cwd()}/testDir/root.js`,
    ],
  }

  const result = [
    "/Users/georgemichael/Code/Procore/vulture/testDir/anotherNestedDir/unused.js",
    "/Users/georgemichael/Code/Procore/vulture/testDir/nestedDir/unused.js",
    "/Users/georgemichael/Code/Procore/vulture/testDir/siblingUnused.js",
    "/Users/georgemichael/Code/Procore/vulture/testDir/unused.js",
    "/Users/georgemichael/Code/Procore/vulture/testDir/unusedWithImports.js",
  ].sort()

  expect.assertions(1);
  return expect(run(defaultConfig)).resolves.toEqual(result)
});
