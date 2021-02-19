import { validate } from 'schema-utils';
import mime from 'mime-types';

import middleware from './middleware';
import setupHooks from './utils/setupHooks';
import setupWriteToDisk from './utils/setupWriteToDisk';
import setupOutputFileSystem from './utils/setupOutputFileSystem';
import ready from './utils/ready';
import schema from './options.json';

const noop = () => {};
// const webpackDevMiddleware = require('webpack-dev-middleware'); 是此函数
export default function wdm(compiler, options = {}) {
  // 1. schema验证 + 配置mimeTypes
  validate(schema, options, {
    name: 'Dev Middleware',
    baseDataPath: 'options',
  });

  const { mimeTypes } = options;

  if (mimeTypes) {
    const { types } = mime;

    // mimeTypes from user provided options should take priority
    // over existing, known types
    mime.types = { ...types, ...mimeTypes };
  }
  // 1. 设置上下文
  const context = {
    state: false,
    stats: null,
    callbacks: [],
    options,
    compiler,
    watching: null,
  };

  // eslint-disable-next-line no-param-reassign
  context.logger = context.compiler.getInfrastructureLogger(
    'webpack-dev-middleware'
  );
  // 1. 设置compiler.hooks
  setupHooks(context);

  if (options.writeToDisk) {
    setupWriteToDisk(context);
  }
  // 1. 设置compiler的输出文件系统 memfs
  setupOutputFileSystem(context);

  // Start watching
  if (context.compiler.watching) {
    context.watching = context.compiler.watching;
  } else {
    let watchOptions;

    if (Array.isArray(context.compiler.compilers)) {
      watchOptions = context.compiler.compilers.map(
        (childCompiler) => childCompiler.options.watchOptions || {}
      );
    } else {
      watchOptions = context.compiler.options.watchOptions || {};
    }
    // 默认调用watch
    context.watching = context.compiler.watch(watchOptions, (error) => {
      if (error) {
        // TODO: improve that in future
        // For example - `writeToDisk` can throw an error and right now it is ends watching.
        // We can improve that and keep watching active, but it is require API on webpack side.
        // Let's implement that in webpack@5 because it is rare case.
        context.logger.error(error);
      }
    });
  }

  const instance = middleware(context);

  // API
  instance.waitUntilValid = (callback = noop) => {
    ready(context, callback);
  };
  instance.invalidate = (callback = noop) => {
    ready(context, callback);

    context.watching.invalidate();
  };
  instance.close = (callback = noop) => {
    context.watching.close(callback);
  };
  instance.context = context;

  return instance;
}
