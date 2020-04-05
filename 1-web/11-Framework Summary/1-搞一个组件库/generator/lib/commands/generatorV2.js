const execa = require('execa');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const binPath = require.resolve('vue-cli/bin/vue-init');

module.exports = (api) => {
    api.registerCommand('generatorV2', {}, async () => {
        const { context } = api.service;
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Please input name(starts with rex-)',
                default: 'rex-demo',
                validate: (answer) => {
                    if (!answer) {
                        return 'A component name is required';
                    }
                    if (!(answer.startsWith('rex-') && answer.split('-')[1])) {
                        return 'A component name must starts with rex-';
                    }
                    if (fs.existsSync(path.resolve(context, `components/${answer}`))) {
                        return 'A component with the same name exists';
                    }
                    return true;
                },
            },
        ]);
        const templatePath = path.resolve(__dirname, './../../template/');
        // 有个问题： 读取的是template/template ... 怎么改path都不可以-。-
        // 未看vue-cli2的逻辑，故模板template套template
        execa(binPath, [templatePath, answers.name], { stdio: 'inherit' });
    });
};
