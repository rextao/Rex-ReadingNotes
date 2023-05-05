#!/usr/bin/env node

const semver = require('semver');
const requiredVersion = require('../package.json').engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
  console.error(
    `You are using Node ${process.version}, but vue-cli-service ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  )
  process.exit(1)
}

const Service = require('../lib/Service')
const service = new Service(process.cwd())

const rawArgv = process.argv.slice(2)
// 分析参数选项
const args = require('minimist')(rawArgv, {
  boolean: [] // 将某些参数转为boolean
})
const command = args._[0]

service.run(command, args, rawArgv).catch(err => {
  error(err)
  process.exit(1)
})
