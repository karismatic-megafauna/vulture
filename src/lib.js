const path = require('path')
const fs = require('fs-extra')
const fsPromise = require('fs-promise');
const { readdir, stat } = fsPromise;
const { filter } = require('ramda')

// UTILS
const taskDone = task => console.log('taskDone:', task)
const mapP = mapFunction => list => Promise.all(list.map(mapFunction))
const filterValid = filter(x => x)
const debug = x => {
  console.log(JSON.stringify(x, null, 2))
  return x;
}

const excludeIfContains = exclusion => path => {
  const containsExclusion = path.includes(exclusion);
  return containsExclusion ? null : path
}
const sort = list => list.sort()

// FILE UTILS
const fromPath = (dir, sources) => sources.map(file => path.join(dir, file))
const getAbsolutePathFromfile = file => relativePath =>
  path.resolve(path.join(path.dirname(file), relativePath))

const tryFile = file => {
  try {
    return fs.existsSync(file) && file
  } catch (e) {
    return undefined
  }
}

const tryExtensions = extensions => file => extensions.reduce(
  (acc, ext) => acc ? acc : tryFile(file + ext),
  undefined
)

const readDirDeep = async (dir, allFiles = []) => {
  const files = (await readdir(dir)).map(f => path.join(dir, f))
  allFiles.push(...files)
  await Promise.all(files.map(async f => (
    (await stat(f)).isDirectory() && readDirDeep(f, allFiles)
  )))
  return allFiles
}

const getFiles = async (dir) => {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

const readFile = file => {
  return new Promise((resolve, reject) => {
    fs.lstat(file, (err, stats) => {
      if (err) {
        reject(err)
        return
      }
      if (stats.isDirectory()) { return }
      if (stats.isFile()) {
        fs.readFile(file, 'utf-8', (readError, content) => {
          if (readError) {
            reject(readError)
            return
          }
          resolve(content)
        })
      }
    })
  })
}

// PACKAGE.JSON UTILS
const extractNpmDependencies = packageJson => {
  const packageConfig = require(packageJson)
  return packageConfig.dependencies
}

module.exports = {
  debug,
  excludeIfContains,
  extractNpmDependencies,
  fromPath,
  filterValid,
  getAbsolutePathFromfile,
  getDir: path.dirname,
  mapP,
  readFile,
  readDirDeep,
  getFiles,
  taskDone,
  tryExtensions,
  tryFile,
  sort,
}
