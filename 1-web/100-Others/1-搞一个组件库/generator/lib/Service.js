const fs = require('fs')
const path = require('path')
const PluginAPI = require('./PluginAPI')
const defaultsDeep = require('lodash.defaultsdeep')
const chalk = require('chalk');
// const { defaults } = require('./options')

module.exports = class Service {
  constructor (context, { plugins, pkg, inlineOptions, useBuiltIn } = {}) {
    this.initialized = false
    this.context = context
    this.commands = {}
    this.plugins = this.resolvePlugins(plugins, useBuiltIn)
  }

  init () {
    if (this.initialized) {
      return
    }
    this.initialized = true
    // load user config
    const userOptions = this.loadUserOptions()
    this.projectOptions = defaultsDeep(userOptions)
    // apply plugins.
    this.plugins.forEach(({ id, apply }) => {
      apply(new PluginAPI(id, this), this.projectOptions)
    })
  }

  resolvePlugins () {
    // 因为是代码生成，无需读取外部package.json
    const idToPlugin = id => ({
      id: id.replace(/^.\//, 'built-in:'),
      apply: require(id)
    })

    return [
      './commands/generator',
      './commands/generatorV2',
      // './commands/build', ToDo build
      './commands/help',
      // 无需对webpack的扩展
    ].map(idToPlugin)

  }

  async run (name, args = {}, rawArgv = []) {
    this.init()
    args._ = args._ || []
    let command = this.commands[name]
    if (!command && name) {
      console.error(`command "${name}" does not exist.`)
      process.exit(1)
    }
    if (!command || args.help || args.h) {
      command = this.commands.help
    } else {
      args._.shift() // remove command itself
      rawArgv.shift()
    }
    const { fn } = command
    return fn(args, rawArgv)
  }


  loadUserOptions () {
    let fileConfig
    const configPath = path.resolve(this.context, 'vue.config.js');
    if (fs.existsSync(configPath)) {
      try {
        fileConfig = require(configPath)

        if (typeof fileConfig === 'function') {
          fileConfig = fileConfig()
        }

        if (!fileConfig || typeof fileConfig !== 'object') {
          console.error(
            `Error loading ${chalk.bold('vue.config.js')}: should export an object or a function that returns object.`
          )
          fileConfig = null
        }
      } catch (e) {
        console.error(`Error loading ${chalk.bold('vue.config.js')}:`)
        throw e
      }
    }
    return fileConfig
  }
}
