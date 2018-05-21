// Example .config.js file
module.exports = {
  project: process.cwd(),
  sourceDir: `${process.cwd()}/testDir`,
  entryPoints: [
    `${process.cwd()}/testDir/root.js`,
  ],
  alternatePaths: ['src','src/_shared'],
}
