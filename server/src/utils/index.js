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
        ...require(path.resolve(dirpath, filename)).default,
      }),
      {}
    )

// Calculate max depth of a GraphQL query string
const calculateQueryDepth = query => {
  let depth = -1
  let maxDepth = depth

  for (let letter of query) {
    switch (letter) {
      case '{':
        if (++depth > maxDepth) maxDepth = depth
        break
      case '}':
        depth--
    }
  }
  return maxDepth
}

module.exports = { mergeDirectoryModules, calculateQueryDepth }
