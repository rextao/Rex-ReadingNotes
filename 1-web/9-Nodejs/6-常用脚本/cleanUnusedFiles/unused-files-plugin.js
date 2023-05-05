const fs = require('fs');
const glob = require('glob');
const pluginName = 'UnusedFilesPlugin';

class UnusedFilesPlugin {
    constructor(opts) {
        this.options = Object.assign({
            clean: false,
            root: './src', // 目前glob执行在process.cwd()，xxx/scripts下查找
            output: './unused-files.json',
        }, opts);
        this.useFiles = new Set();
        this.allFiles = [];
        this.unUseFiles = [];
    }
    getUnUseFiles() {
        this.unUseFiles = this.allFiles.filter(item => Array.from(this.useFiles).indexOf(item) === -1);
    }
    writeFile() {
        fs.writeFileSync(this.options.output, JSON.stringify(this.unUseFiles, null, 4));
    }
    cleanFiles() {
        if (this.options.clean) {
            this.unUseFiles.forEach(file => {
                fs.rmSync(file);
            });
        }
    }

    handleFinishModules() {
        this.getUnUseFiles();
        this.writeFile();
        this.cleanFiles();
        console.warn(
            '\u001b[33m 使用unused-files-plugin插件，提取无用文件，将提前停止webpack \u001b[39m\n',
        );
        throw new Error('unused-files-plugin 插件 提前结束');
    }
    handleSucceedModule(module) {
        const {
            buildInfo: { fileDependencies },
        } = module;
        if (fileDependencies) {
            for (const dep of fileDependencies) {
                if (!dep.includes('node_modules')) {
                    this.useFiles.add(dep);
                }
            }
        }
    }
    apply(compiler) {
        const { ignore, root } = this.options;
        glob(`${root}/**/*`, { nodir: true, realpath: true, ignore }, (err, files) => {
            this.allFiles = files;
        });
        compiler.hooks.compilation.tap(pluginName, compilation => {
            compilation.hooks.finishModules.tap(
                pluginName,
                this.handleFinishModules.bind(this),
            );
            compilation.hooks.succeedModule.tap(
                pluginName,
                this.handleSucceedModule.bind(this),
            );
        });
    }
}

module.exports = UnusedFilesPlugin;
