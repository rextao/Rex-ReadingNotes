const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const generate = require('./../cli/generate');
const templateOptions = require('./../cli/options');
module.exports = (api) => {
  // 函数是最终要执行的函数
  api.registerCommand('generator', async () => {
      const { context } = api.service;
      const targetDir = 'components'; // 生成文件在 运行命令文件夹的components文件夹下
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
                  if (fs.existsSync(path.resolve(context, `${targetDir}/${answer}`))) {
                      return 'A component with the same name exists';
                  }
                  return true;
              },
          },
      ]);
      const source = path.resolve(__dirname, '../../template');
      generate(`${context}/${targetDir}/${answers.name}`, source, templateOptions)
  })
}
