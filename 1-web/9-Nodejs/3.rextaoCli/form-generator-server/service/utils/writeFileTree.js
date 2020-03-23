const fs = require('fs-extra')
const path = require('path')

function deleteRemovedFiles (directory, newFiles, previousFiles) {
  const filesToDelete = Object.keys(previousFiles)
    .filter(filename => !newFiles[filename])

  return Promise.all(filesToDelete.map(filename => {
    return fs.unlink(path.join(directory, filename))
  }))
}

/**
 * 将files对象，写到dir
 * 对于如下file， 会在main文件夹下生成如下文件
 * @param dir  main/
 * files = {
 *     'table/index.vue': xxxxx
 *     'text.vue': adsfasdf
 * }
 *
 */
module.exports = async function writeFileTree (dir, files) {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name)
    fs.ensureDirSync(path.dirname(filePath))
    fs.writeFileSync(filePath, files[name])
  })
}
