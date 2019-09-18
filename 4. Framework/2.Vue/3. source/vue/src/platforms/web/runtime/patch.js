/* @flow */
// nodeOps实际是dom操作的原生方法
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
// Todo 定义很多属性等钩子函数，创建dom还会有属性，style，利用platformModules里面的钩子进行处理
// 之后会介绍
import platformModules from 'web/runtime/modules/index'

// 指令模块（baseModules）要在所有内置模块（platformModules）之后运行
const modules = platformModules.concat(baseModules)
// im： 高阶函数，利用柯里化解决不同平台差异，避免在函数中使用if-else进行判断，可以第一次统一解决不同平台差异问题
// createPatchFunction是一个闭包，实际patch会执行createPatchFunction返回的函数
export const patch: Function = createPatchFunction({ nodeOps, modules })
