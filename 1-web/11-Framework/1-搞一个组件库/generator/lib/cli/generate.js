const fs = require('fs')
const path = require('path')
const { isBinaryFileSync } = require('isbinaryfile')
const writeFileTree = require('./../util/writeFileTree')
const globby = require('globby')
const handlebars = require('handlebars')
module.exports = async (context, source, options) => {
    const files = {};
    const _files = await globby(['**/*'], { cwd: source });
    for (const rawPath of _files) {
        const targetPath = rawPath.split('/').map(filename => {
            if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
                return `.${filename.slice(1)}`
            }
            if (filename.charAt(0) === '_' && filename.charAt(1) === '_') {
                return `${filename.slice(1)}`
            }
            return filename
        }).join('/')
        const sourcePath = path.resolve(source, rawPath)
        const content = renderFile(sourcePath)
        const template = handlebars.compile(content);
        try {
            const result = await template(options);
            // only set file if it's not all whitespace, or is a Buffer (binary files)
            if (Buffer.isBuffer(result) || /[^\s]/.test(result)) {
                files[targetPath] = result
            }
        } catch (e) {
            console.log(e)
        }
    }
    await writeFileTree(context, files);
};
function renderFile (name) {
    if (isBinaryFileSync(name)) {
        return fs.readFileSync(name) // return buffer
    }
    return fs.readFileSync(name, 'utf-8')
}
