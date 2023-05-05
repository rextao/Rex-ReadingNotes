/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // baseCompile，此为编译的核心3步，生成ast，优化ast，通过ast生成code
  // 对于web平台实际此处options是：src/platforms/web/compiler/options.js
  const ast = parse(template.trim(), options)
  // ast优化：并不是所有数据都是响应式的，
  // 很多数据是首次渲染后就永远不会变化的，
  // 那么这部分数据生成的 DOM 也不会变化，
  // 可以在 patch 的过程跳过对他们的比对。
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  // 代码生成，将ast转换为code字符串
  // 对于生成代码调用的_c,_l都定义在  src/core/instance/render-helpers/index.js
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
