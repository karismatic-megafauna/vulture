// Example .config.js file
module.exports = {
  project: process.cwd(),
  sourceDir: `${process.cwd()}/exampleDir`,
  entryPoints: [
    `${process.cwd()}/exampleDir/root.js`,
  ],
  alternatePaths: ['src','src/_shared'],
}
