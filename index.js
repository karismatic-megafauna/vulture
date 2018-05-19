 const path = require('path');
 const fsPromise = require('fs-promise');
 const { readdir, stat } = fsPromise;

 async function rreaddir (dir, allFiles = []) {
   const files = (await readdir(dir)).map(f => path.join(dir, f))
   allFiles.push(...files)
   await Promise.all(files.map(async f => (
     (await stat(f)).isDirectory() && rreaddir(f, allFiles)
   )))
   return allFiles
 }

 rreaddir(path.join(process.cwd(), process.argv[2])).then(x => console.log(x))
