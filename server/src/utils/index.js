import fs from 'fs'
import path from 'path'

// Require all the modules in the specified directory
export const mergeDirectoryModules = dirpath =>
  fs
    .readdirSync(dirpath, 'utf8')
    .filter(filename => !/^[_|index.]/.test(filename))
    .reduce(
      (acc, filename) => ({
        ...acc,
        ...require(path.resolve(dirpath, filename)),
      }),
      {}
    )
