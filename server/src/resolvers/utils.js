const fs = require('fs')
const path = require('path')

// Require all the modules in the specified directory
const mergeDirectoryModules = dirpath =>
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

module.exports = { mergeDirectoryModules }
