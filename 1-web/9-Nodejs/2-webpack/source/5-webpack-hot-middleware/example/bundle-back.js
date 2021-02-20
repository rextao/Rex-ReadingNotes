(function(modules) { // webpackBootstrap
  function hotDisposeChunk(chunkId) {
      delete installedChunks[chunkId];
  }
  var parentHotUpdateCallback = window["webpackHotUpdate"];
  window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
  function webpackHotUpdateCallback(chunkId, moreModules) {
      hotAddUpdateChunk(chunkId, moreModules);
      if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
  } ;

  // eslint-disable-next-line no-unused-vars
  function hotDownloadUpdateChunk(chunkId) {
      var script = document.createElement("script");
      script.charset = "utf-8";
      script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
      if (null) script.crossOrigin = null;
      document.head.appendChild(script);
  }

  // eslint-disable-next-line no-unused-vars
  function hotDownloadManifest(requestTimeout) {
      requestTimeout = requestTimeout || 10000;
      return new Promise(function(resolve, reject) {
          if (typeof XMLHttpRequest === "undefined") {
              return reject(new Error("No browser support"));
          }
          try {
              var request = new XMLHttpRequest();
              // __webpack_require__.p = '/' publicPath
              var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
              request.open("GET", requestPath, true);
              request.timeout = requestTimeout;
              request.send(null);
          } catch (err) {
              return reject(err);
          }
          request.onreadystatechange = function() {
              if (request.readyState !== 4) return;
              if (request.status === 0) {
                  // timeout
                  reject(
                      new Error("Manifest request to " + requestPath + " timed out.")
                  );
              } else if (request.status === 404) {
                  // no update available
                  resolve();
              } else if (request.status !== 200 && request.status !== 304) {
                  // other failure
                  reject(new Error("Manifest request to " + requestPath + " failed."));
              } else {
                  // success
                  try {
                      var update = JSON.parse(request.responseText);
                  } catch (e) {
                      reject(e);
                      return;
                  }
                  resolve(update);
              }
          };
      });
  }

  var hotApplyOnUpdate = true;
  // eslint-disable-next-line no-unused-vars
  var hotCurrentHash = "aa511a3c14510c51ec79";
  var hotRequestTimeout = 10000;
  var hotCurrentModuleData = {};
  var hotCurrentChildModule;
  // eslint-disable-next-line no-unused-vars
  var hotCurrentParents = [];
  // eslint-disable-next-line no-unused-vars
  var hotCurrentParentsTemp = [];

  // eslint-disable-next-line no-unused-vars
  function hotCreateRequire(moduleId) {
      var me = installedModules[moduleId];
      if (!me) return __webpack_require__;
      var fn = function(request) {
          if (me.hot.active) {
              if (installedModules[request]) {
                  if (installedModules[request].parents.indexOf(moduleId) === -1) {
                      installedModules[request].parents.push(moduleId);
                  }
              } else {
                  hotCurrentParents = [moduleId];
                  hotCurrentChildModule = request;
              }
              if (me.children.indexOf(request) === -1) {
                  me.children.push(request);
              }
          } else {
              console.warn(
                  "[HMR] unexpected require(" +
                      request +
                      ") from disposed module " +
                      moduleId
              );
              hotCurrentParents = [];
          }
          return __webpack_require__(request);
      };
      var ObjectFactory = function ObjectFactory(name) {
          return {
              configurable: true,
              enumerable: true,
              get: function() {
                  return __webpack_require__[name];
              },
              set: function(value) {
                  __webpack_require__[name] = value;
              }
          };
      };
      for (var name in __webpack_require__) {
          if (
              Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
              name !== "e" &&
              name !== "t"
          ) {
              Object.defineProperty(fn, name, ObjectFactory(name));
          }
      }
      fn.e = function(chunkId) {
          if (hotStatus === "ready") hotSetStatus("prepare");
          hotChunksLoading++;
          return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
              finishChunkLoading();
              throw err;
          });

          function finishChunkLoading() {
              hotChunksLoading--;
              if (hotStatus === "prepare") {
                  if (!hotWaitingFilesMap[chunkId]) {
                      hotEnsureUpdateChunk(chunkId);
                  }
                  if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
                      hotUpdateDownloaded();
                  }
              }
          }
      };
      fn.t = function(value, mode) {
          if (mode & 1) value = fn(value);
          return __webpack_require__.t(value, mode & ~1);
      };
      return fn;
  }

  // eslint-disable-next-line no-unused-vars
  function hotCreateModule(moduleId) {
      var hot = {
          // private stuff
          _acceptedDependencies: {},
          _declinedDependencies: {},
          _selfAccepted: false,
          _selfDeclined: false,
          _selfInvalidated: false,
          _disposeHandlers: [],
          _main: hotCurrentChildModule !== moduleId,

          // Module API
          active: true,
          accept: function(dep, callback) {
              if (dep === undefined) hot._selfAccepted = true;
              else if (typeof dep === "function") hot._selfAccepted = dep;
              else if (typeof dep === "object")
                  for (var i = 0; i < dep.length; i++)
                      hot._acceptedDependencies[dep[i]] = callback || function() {};
              else hot._acceptedDependencies[dep] = callback || function() {};
          },
          decline: function(dep) {
              if (dep === undefined) hot._selfDeclined = true;
              else if (typeof dep === "object")
                  for (var i = 0; i < dep.length; i++)
                      hot._declinedDependencies[dep[i]] = true;
              else hot._declinedDependencies[dep] = true;
          },
          dispose: function(callback) {
              hot._disposeHandlers.push(callback);
          },
          addDisposeHandler: function(callback) {
              hot._disposeHandlers.push(callback);
          },
          removeDisposeHandler: function(callback) {
              var idx = hot._disposeHandlers.indexOf(callback);
              if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
          },
          invalidate: function() {
              this._selfInvalidated = true;
              switch (hotStatus) {
                  case "idle":
                      hotUpdate = {};
                      hotUpdate[moduleId] = modules[moduleId];
                      hotSetStatus("ready");
                      break;
                  case "ready":
                      hotApplyInvalidatedModule(moduleId);
                      break;
                  case "prepare":
                  case "check":
                  case "dispose":
                  case "apply":
                      (hotQueuedInvalidatedModules =
                          hotQueuedInvalidatedModules || []).push(moduleId);
                      break;
                  default:
                      // ignore requests in error states
                      break;
              }
          },

          // Management API
          check: hotCheck,
          apply: hotApply,
          status: function(l) {
              if (!l) return hotStatus;
              hotStatusHandlers.push(l);
          },
          addStatusHandler: function(l) {
              hotStatusHandlers.push(l);
          },
          removeStatusHandler: function(l) {
              var idx = hotStatusHandlers.indexOf(l);
              if (idx >= 0) hotStatusHandlers.splice(idx, 1);
          },

          //inherit from previous dispose call
          data: hotCurrentModuleData[moduleId]
      };
      hotCurrentChildModule = undefined;
      return hot;
  }

  var hotStatusHandlers = [];
  var hotStatus = "idle";

  function hotSetStatus(newStatus) {
      hotStatus = newStatus;
      // hot.status，可传入参数，此时调用
      for (var i = 0; i < hotStatusHandlers.length; i++)
          hotStatusHandlers[i].call(null, newStatus);
  }

  // while downloading
  var hotWaitingFiles = 0;
  var hotChunksLoading = 0;
  var hotWaitingFilesMap = {};
  var hotRequestedFilesMap = {};
  var hotAvailableFilesMap = {};
  var hotDeferred;

  // The update info
  var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;

  function toModuleId(id) {
      var isNumber = +id + "" === id;
      return isNumber ? +id : id;
  }

  function hotCheck(apply) {
      if (hotStatus !== "idle") {
          throw new Error("check() is only allowed in idle status");
      }
      hotApplyOnUpdate = apply;
      // 更改hot状态为check
      // 执行 hotStatusHandlers 函数数组
      // hot.status(l) => hotStatusHandlers.push(l)
      // 或调用 hot.addStatusHandler
      hotSetStatus("check");
      return hotDownloadManifest(hotRequestTimeout).then(function(update) {
          if (!update) {
              hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
              return null;
          }
          hotRequestedFilesMap = {};
          hotWaitingFilesMap = {};
          hotAvailableFilesMap = update.c;
          hotUpdateNewHash = update.h;

          hotSetStatus("prepare");
          var promise = new Promise(function(resolve, reject) {
              hotDeferred = {
                  resolve: resolve,
                  reject: reject
              };
          });
          hotUpdate = {};
          // 对应热更新js是 main.xxxxxx.js
          var chunkId = "main";
          // eslint-disable-next-line no-lone-blocks
          {
              // 如果未缓存当前chunkId对应的 js
              // 则将js利用script插在head末尾；只添加不删除
              // 当前情况下：hotWaitingFiles++ ，故不会执行下面hotUpdateDownloaded
              hotEnsureUpdateChunk(chunkId);
          }
          if (
              hotStatus === "prepare" &&
              hotChunksLoading === 0 &&
              hotWaitingFiles === 0
          ) {
              hotUpdateDownloaded();
          }
          return promise;
      });
  }

  // eslint-disable-next-line no-unused-vars
  function hotAddUpdateChunk(chunkId, moreModules) {
      if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
          return;
      hotRequestedFilesMap[chunkId] = false;
      for (var moduleId in moreModules) {
          if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
              hotUpdate[moduleId] = moreModules[moduleId];
          }
      }
      if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
          hotUpdateDownloaded();
      }
  }

  function hotEnsureUpdateChunk(chunkId) {
      if (!hotAvailableFilesMap[chunkId]) {
          hotWaitingFilesMap[chunkId] = true;
      } else {
          hotRequestedFilesMap[chunkId] = true;
          hotWaitingFiles++;
          hotDownloadUpdateChunk(chunkId);
      }
  }

  function hotUpdateDownloaded() {
      hotSetStatus("ready");
      var deferred = hotDeferred;
      hotDeferred = null;
      if (!deferred) return;
      if (hotApplyOnUpdate) {
          // Wrap deferred object in Promise to mark it as a well-handled Promise to
          // avoid triggering uncaught exception warning in Chrome.
          // See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
          Promise.resolve()
              .then(function() {
                  return hotApply(hotApplyOnUpdate);
              })
              .then(
                  function(result) {
                      deferred.resolve(result);
                  },
                  function(err) {
                      deferred.reject(err);
                  }
              );
      } else {
          var outdatedModules = [];
          for (var id in hotUpdate) {
              if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
                  outdatedModules.push(toModuleId(id));
              }
          }
          deferred.resolve(outdatedModules);
      }
  }

  function hotApply(options) {
      if (hotStatus !== "ready")
          throw new Error("apply() is only allowed in ready status");
      options = options || {};
      return hotApplyInternal(options);
  }

  function hotApplyInternal(options) {
      hotApplyInvalidatedModules();

      var cb;
      var i;
      var j;
      var module;
      var moduleId;

      function getAffectedStuff(updateModuleId) {
          var outdatedModules = [updateModuleId];
          var outdatedDependencies = {};

          var queue = outdatedModules.map(function(id) {
              return {
                  chain: [id],
                  id: id
              };
          });
          while (queue.length > 0) {
              var queueItem = queue.pop();
              var moduleId = queueItem.id;
              var chain = queueItem.chain;
              module = installedModules[moduleId];
              if (
                  !module ||
                  (module.hot._selfAccepted && !module.hot._selfInvalidated)
              )
                  continue;
              if (module.hot._selfDeclined) {
                  return {
                      type: "self-declined",
                      chain: chain,
                      moduleId: moduleId
                  };
              }
              if (module.hot._main) {
                  return {
                      type: "unaccepted",
                      chain: chain,
                      moduleId: moduleId
                  };
              }
              for (var i = 0; i < module.parents.length; i++) {
                  var parentId = module.parents[i];
                  var parent = installedModules[parentId];
                  if (!parent) continue;
                  if (parent.hot._declinedDependencies[moduleId]) {
                      return {
                          type: "declined",
                          chain: chain.concat([parentId]),
                          moduleId: moduleId,
                          parentId: parentId
                      };
                  }
                  if (outdatedModules.indexOf(parentId) !== -1) continue;
                  if (parent.hot._acceptedDependencies[moduleId]) {
                      if (!outdatedDependencies[parentId])
                          outdatedDependencies[parentId] = [];
                      addAllToSet(outdatedDependencies[parentId], [moduleId]);
                      continue;
                  }
                  delete outdatedDependencies[parentId];
                  outdatedModules.push(parentId);
                  queue.push({
                      chain: chain.concat([parentId]),
                      id: parentId
                  });
              }
          }

          return {
              type: "accepted",
              moduleId: updateModuleId,
              outdatedModules: outdatedModules,
              outdatedDependencies: outdatedDependencies
          };
      }

      function addAllToSet(a, b) {
          for (var i = 0; i < b.length; i++) {
              var item = b[i];
              if (a.indexOf(item) === -1) a.push(item);
          }
      }

      // at begin all updates modules are outdated
      // the "outdated" status can propagate to parents if they don't accept the children
      var outdatedDependencies = {};
      var outdatedModules = [];
      var appliedUpdate = {};

      var warnUnexpectedRequire = function warnUnexpectedRequire() {
          console.warn(
              "[HMR] unexpected require(" + result.moduleId + ") to disposed module"
          );
      };

      for (var id in hotUpdate) {
          if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
              moduleId = toModuleId(id);
              /** @type {TODO} */
              var result;
              // 如果模块卸载，会被设为false
              if (hotUpdate[id]) {
                  result = getAffectedStuff(moduleId);
              } else {
                  result = {
                      type: "disposed",
                      moduleId: id
                  };
              }
              /** @type {Error|false} */
              var abortError = false;
              var doApply = false;
              var doDispose = false;
              var chainInfo = "";
              if (result.chain) {
                  chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
              }
              switch (result.type) {
                  case "self-declined":
                      if (options.onDeclined) options.onDeclined(result);
                      if (!options.ignoreDeclined)
                          abortError = new Error(
                              "Aborted because of self decline: " +
                                  result.moduleId +
                                  chainInfo
                          );
                      break;
                  case "declined":
                      if (options.onDeclined) options.onDeclined(result);
                      if (!options.ignoreDeclined)
                          abortError = new Error(
                              "Aborted because of declined dependency: " +
                                  result.moduleId +
                                  " in " +
                                  result.parentId +
                                  chainInfo
                          );
                      break;
                  case "unaccepted":
                      if (options.onUnaccepted) options.onUnaccepted(result);
                      if (!options.ignoreUnaccepted)
                          abortError = new Error(
                              "Aborted because " + moduleId + " is not accepted" + chainInfo
                          );
                      break;
                  case "accepted":
                      if (options.onAccepted) options.onAccepted(result);
                      doApply = true;
                      break;
                  case "disposed":
                      if (options.onDisposed) options.onDisposed(result);
                      doDispose = true;
                      break;
                  default:
                      throw new Error("Unexception type " + result.type);
              }
              if (abortError) {
                  hotSetStatus("abort");
                  return Promise.reject(abortError);
              }
              if (doApply) {
                  // 方法
                  appliedUpdate[moduleId] = hotUpdate[moduleId];
                  addAllToSet(outdatedModules, result.outdatedModules);
                  for (moduleId in result.outdatedDependencies) {
                      if (
                          Object.prototype.hasOwnProperty.call(
                              result.outdatedDependencies,
                              moduleId
                          )
                      ) {
                          if (!outdatedDependencies[moduleId])
                              outdatedDependencies[moduleId] = [];
                          addAllToSet(
                              outdatedDependencies[moduleId],
                              result.outdatedDependencies[moduleId]
                          );
                      }
                  }
              }
              if (doDispose) {
                  // push到outdatedModules中
                  addAllToSet(outdatedModules, [result.moduleId]);
                  // console.warn 函数
                  appliedUpdate[moduleId] = warnUnexpectedRequire;
              }
          }
      }

      // Store self accepted outdated modules to require them later by the module system
      var outdatedSelfAcceptedModules = [];
      for (i = 0; i < outdatedModules.length; i++) {
          moduleId = outdatedModules[i];
          if (
              installedModules[moduleId] &&
              installedModules[moduleId].hot._selfAccepted &&
              // removed self-accepted modules should not be required
              appliedUpdate[moduleId] !== warnUnexpectedRequire &&
              // when called invalidate self-accepting is not possible
              !installedModules[moduleId].hot._selfInvalidated
          ) {
              outdatedSelfAcceptedModules.push({
                  module: moduleId,
                  parents: installedModules[moduleId].parents.slice(),
                  errorHandler: installedModules[moduleId].hot._selfAccepted
              });
          }
      }

      // Now in "dispose" phase
      hotSetStatus("dispose");
      Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
          if (hotAvailableFilesMap[chunkId] === false) {
              hotDisposeChunk(chunkId);
          }
      });

      var idx;
      var queue = outdatedModules.slice();
      while (queue.length > 0) {
          moduleId = queue.pop();
          module = installedModules[moduleId];
          if (!module) continue;

          var data = {};

          // Call dispose handlers
          // 外部调用 dispose 时， 会 hot._disposeHandlers.push(cb)
          // 如经常会在js写
          // if (module.hot) {
          //     module.hot.dispose(function () {
          //         xxxxxxx
          //     });
          // }
          var disposeHandlers = module.hot._disposeHandlers;
          for (j = 0; j < disposeHandlers.length; j++) {
              cb = disposeHandlers[j];
              cb(data);
          }
          hotCurrentModuleData[moduleId] = data;

          // disable module (this disables requires from this module)
          module.hot.active = false;

          // remove module from cache
          delete installedModules[moduleId];

          // when disposing there is no need to call dispose handler
          delete outdatedDependencies[moduleId];

          // remove "parents" references from all children
          for (j = 0; j < module.children.length; j++) {
              var child = installedModules[module.children[j]];
              if (!child) continue;
              idx = child.parents.indexOf(moduleId);
              if (idx >= 0) {
                  child.parents.splice(idx, 1);
              }
          }
      }

      // remove outdated dependency from module children
      var dependency;
      var moduleOutdatedDependencies;
      for (moduleId in outdatedDependencies) {
          if (
              Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
          ) {
              module = installedModules[moduleId];
              if (module) {
                  moduleOutdatedDependencies = outdatedDependencies[moduleId];
                  for (j = 0; j < moduleOutdatedDependencies.length; j++) {
                      dependency = moduleOutdatedDependencies[j];
                      idx = module.children.indexOf(dependency);
                      if (idx >= 0) module.children.splice(idx, 1);
                  }
              }
          }
      }

      // Now in "apply" phase
      hotSetStatus("apply");

      if (hotUpdateNewHash !== undefined) {
          hotCurrentHash = hotUpdateNewHash;
          hotUpdateNewHash = undefined;
      }
      hotUpdate = undefined;

      // insert new code
      for (moduleId in appliedUpdate) {
          if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
              modules[moduleId] = appliedUpdate[moduleId];
          }
      }

      // call accept handlers
      var error = null;
      // 内部调用： modele.hot._acceptedDependencies, 会根据 hot.accept(dep,callback)，对其进行赋值
      for (moduleId in outdatedDependencies) {
          if (
              Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
          ) {
              module = installedModules[moduleId];
              if (module) {
                  moduleOutdatedDependencies = outdatedDependencies[moduleId];
                  var callbacks = [];
                  for (i = 0; i < moduleOutdatedDependencies.length; i++) {
                      dependency = moduleOutdatedDependencies[i];
                      cb = module.hot._acceptedDependencies[dependency];
                      if (cb) {
                          if (callbacks.indexOf(cb) !== -1) continue;
                          callbacks.push(cb);
                      }
                  }
                  for (i = 0; i < callbacks.length; i++) {
                      cb = callbacks[i];
                      try {
                          cb(moduleOutdatedDependencies);
                      } catch (err) {
                          if (options.onErrored) {
                              options.onErrored({
                                  type: "accept-errored",
                                  moduleId: moduleId,
                                  dependencyId: moduleOutdatedDependencies[i],
                                  error: err
                              });
                          }
                          if (!options.ignoreErrored) {
                              if (!error) error = err;
                          }
                      }
                  }
              }
          }
      }

      // Load self accepted modules
      for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
          var item = outdatedSelfAcceptedModules[i];
          moduleId = item.module;
          hotCurrentParents = item.parents;
          hotCurrentChildModule = moduleId;
          try {
              __webpack_require__(moduleId);
          } catch (err) {
              if (typeof item.errorHandler === "function") {
                  try {
                      item.errorHandler(err);
                  } catch (err2) {
                      if (options.onErrored) {
                          options.onErrored({
                              type: "self-accept-error-handler-errored",
                              moduleId: moduleId,
                              error: err2,
                              originalError: err
                          });
                      }
                      if (!options.ignoreErrored) {
                          if (!error) error = err2;
                      }
                      if (!error) error = err;
                  }
              } else {
                  if (options.onErrored) {
                      options.onErrored({
                          type: "self-accept-errored",
                          moduleId: moduleId,
                          error: err
                      });
                  }
                  if (!options.ignoreErrored) {
                      if (!error) error = err;
                  }
              }
          }
      }

      // handle errors in accept handlers and self accepted module load
      if (error) {
          hotSetStatus("fail");
          return Promise.reject(error);
      }

      if (hotQueuedInvalidatedModules) {
          return hotApplyInternal(options).then(function(list) {
              outdatedModules.forEach(function(moduleId) {
                  if (list.indexOf(moduleId) < 0) list.push(moduleId);
              });
              return list;
          });
      }

      hotSetStatus("idle");
      return new Promise(function(resolve) {
          resolve(outdatedModules);
      });
  }

  function hotApplyInvalidatedModules() {
      if (hotQueuedInvalidatedModules) {
          if (!hotUpdate) hotUpdate = {};
          hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
          hotQueuedInvalidatedModules = undefined;
          return true;
      }
  }

  function hotApplyInvalidatedModule(moduleId) {
      if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
          hotUpdate[moduleId] = modules[moduleId];
  }

  // The module cache
  var installedModules = {};

  // The require function
  function __webpack_require__(moduleId) {

      // Check if module is in cache
      if(installedModules[moduleId]) {
          return installedModules[moduleId].exports;
      }
      // Create a new module (and put it into the cache)
      var module = installedModules[moduleId] = {
          i: moduleId,
          l: false,
          exports: {},
          hot: hotCreateModule(moduleId),
          parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
          children: []
      };

      // Execute the module function
      modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

      // Flag the module as loaded
      module.l = true;

      // Return the exports of the module
      return module.exports;
  }


  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  __webpack_require__.d = function(exports, name, getter) {
      if(!__webpack_require__.o(exports, name)) {
          Object.defineProperty(exports, name, { enumerable: true, get: getter });
      }
  };

  // define __esModule on exports
  __webpack_require__.r = function(exports) {
      if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      }
      Object.defineProperty(exports, '__esModule', { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function(value, mode) {
      if(mode & 1) value = __webpack_require__(value);
      if(mode & 8) return value;
      if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
      var ns = Object.create(null);
      __webpack_require__.r(ns);
      Object.defineProperty(ns, 'default', { enumerable: true, value: value });
      if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
      return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function(module) {
      var getter = module && module.__esModule ?
          function getDefault() { return module['default']; } :
          function getModuleExports() { return module; };
      __webpack_require__.d(getter, 'a', getter);
      return getter;
  };

  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

  // __webpack_public_path__
  __webpack_require__.p = "/";

  // __webpack_hash__
  __webpack_require__.h = function() { return hotCurrentHash; };


  // Load entry module and return exports
  return hotCreateRequire(0)(__webpack_require__.s = 0);
})
/************************************************************************/
({

/***/ "../client-overlay.js":
/*!****************************!*\
!*** ../client-overlay.js ***!
\****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
background: 'rgba(0,0,0,0.85)',
color: '#e8e8e8',
lineHeight: '1.6',
whiteSpace: 'pre',
fontFamily: 'Menlo, Consolas, monospace',
fontSize: '13px',
position: 'fixed',
zIndex: 9999,
padding: '10px',
left: 0,
right: 0,
top: 0,
bottom: 0,
overflow: 'auto',
dir: 'ltr',
textAlign: 'left',
};

var ansiHTML = __webpack_require__(/*! ansi-html */ "../node_modules/ansi-html/index.js");
var colors = {
reset: ['transparent', 'transparent'],
black: '181818',
red: 'ff3348',
green: '3fff4f',
yellow: 'ffd30e',
blue: '169be0',
magenta: 'f840b7',
cyan: '0ad8e9',
lightgrey: 'ebe7e3',
darkgrey: '6d7891',
};

var htmlEntities = __webpack_require__(/*! html-entities */ "../node_modules/html-entities/lib/index.js");

function showProblems(type, lines) {
clientOverlay.innerHTML = '';
lines.forEach(function (msg) {
  msg = ansiHTML(htmlEntities.encode(msg));
  var div = document.createElement('div');
  div.style.marginBottom = '26px';
  div.innerHTML = problemType(type) + ' in ' + msg;
  clientOverlay.appendChild(div);
});
if (document.body) {
  document.body.appendChild(clientOverlay);
}
}

function clear() {
if (document.body && clientOverlay.parentNode) {
  document.body.removeChild(clientOverlay);
}
}

function problemType(type) {
var problemColors = {
  errors: colors.red,
  warnings: colors.yellow,
};
var color = problemColors[type] || colors.red;
return (
  '<span style="background-color:#' +
  color +
  '; color:#000000; padding:3px 6px; border-radius: 4px;">' +
  type.slice(0, -1).toUpperCase() +
  '</span>'
);
}

module.exports = function (options) {
for (var color in options.ansiColors) {
  if (color in colors) {
    colors[color] = options.ansiColors[color];
  }
  ansiHTML.setColors(colors);
}

for (var style in options.overlayStyles) {
  styles[style] = options.overlayStyles[style];
}

for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

return {
  showProblems: showProblems,
  clear: clear,
};
};

module.exports.clear = clear;
module.exports.showProblems = showProblems;


/***/ }),

/***/ "../client.js?path=/__webpack_hmr&timeout=20000":
/*!******************************************************!*\
!*** ../client.js?path=/__webpack_hmr&timeout=20000 ***!
\******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
path: '/__webpack_hmr',
timeout: 20 * 1000,
overlay: true,
reload: false,
log: true,
warn: true,
name: '',
autoConnect: true,
overlayStyles: {},
overlayWarnings: false,
ansiColors: {},
};
// 参见 https://www.webpackjs.com/api/module-variables/#__resourcequery-webpack-%E7%89%B9%E6%9C%89%E5%8F%98%E9%87%8F-
// 如这样调用require('file.js?test')，则在file.js中，存在 __resourceQuery === '?test'
if (true) {
var querystring = __webpack_require__(/*! querystring */ "./node_modules/querystring-es3/index.js");
var overrides = querystring.parse(__resourceQuery.slice(1));
// 根据解析参数复写options
setOverrides(overrides);
}

if (typeof window === 'undefined') {
// do nothing
} else if (typeof window.EventSource === 'undefined') {
console.warn(
  "webpack-hot-middleware's client requires EventSource to work. " +
    'You should include a polyfill if you want to support this browser: ' +
    'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools'
);
} else {
if (options.autoConnect) {
  connect();
}
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
setOverrides(overrides);
connect();
}

function setOverrides(overrides) {
if (overrides.autoConnect)
  options.autoConnect = overrides.autoConnect == 'true';
if (overrides.path) options.path = overrides.path;
if (overrides.timeout) options.timeout = overrides.timeout;
if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
if (overrides.reload) options.reload = overrides.reload !== 'false';
if (overrides.noInfo && overrides.noInfo !== 'false') {
  options.log = false;
}
if (overrides.name) {
  options.name = overrides.name;
}
if (overrides.quiet && overrides.quiet !== 'false') {
  options.log = false;
  options.warn = false;
}

if (overrides.dynamicPublicPath) {
  options.path = __webpack_require__.p + options.path;
}

if (overrides.ansiColors)
  options.ansiColors = JSON.parse(overrides.ansiColors);
if (overrides.overlayStyles)
  options.overlayStyles = JSON.parse(overrides.overlayStyles);

if (overrides.overlayWarnings) {
  options.overlayWarnings = overrides.overlayWarnings == 'true';
}
}

function EventSourceWrapper() {
var source;
var lastActivity = new Date();
var listeners = [];

init();
var timer = setInterval(function () {
  if (new Date() - lastActivity > options.timeout) {
    handleDisconnect();
  }
}, options.timeout / 2);

function init() {
  source = new window.EventSource(options.path);
  source.onopen = handleOnline;
  source.onerror = handleDisconnect;
  source.onmessage = handleMessage;
}

function handleOnline() {
  if (options.log) console.log('[HMR] connected');
  lastActivity = new Date();
}

function handleMessage(event) {
  lastActivity = new Date();
  for (var i = 0; i < listeners.length; i++) {
    listeners[i](event);
  }
}

function handleDisconnect() {
  clearInterval(timer);
  source.close();
  setTimeout(init, options.timeout);
}

return {
  addMessageListener: function (fn) {
    listeners.push(fn);
  },
};
}

function getEventSourceWrapper() {
if (!window.__whmEventSourceWrapper) {
  window.__whmEventSourceWrapper = {};
}
if (!window.__whmEventSourceWrapper[options.path]) {
  // cache the wrapper for other entries loaded on
  // the same page with the same options.path
  window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
}
return window.__whmEventSourceWrapper[options.path];
}

function connect() {
getEventSourceWrapper().addMessageListener(handleMessage);

function handleMessage(event) {
  // 心跳标识
  if (event.data == '\uD83D\uDC93') {
    return;
  }
  try {
    processMessage(JSON.parse(event.data));
  } catch (ex) {
    if (options.warn) {
      console.warn('Invalid HMR message: ' + event.data + '\n' + ex);
    }
  }
}
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
if (!window[singletonKey]) {
  window[singletonKey] = createReporter();
}
reporter = window[singletonKey];
}

function createReporter() {
var strip = __webpack_require__(/*! strip-ansi */ "../node_modules/strip-ansi/index.js");

var overlay;
if (typeof document !== 'undefined' && options.overlay) {
  overlay = __webpack_require__(/*! ./client-overlay */ "../client-overlay.js")({
    ansiColors: options.ansiColors,
    overlayStyles: options.overlayStyles,
  });
}

var styles = {
  errors: 'color: #ff0000;',
  warnings: 'color: #999933;',
};
var previousProblems = null;
function log(type, obj) {
  var newProblems = obj[type]
    .map(function (msg) {
      return strip(msg);
    })
    .join('\n');
  if (previousProblems == newProblems) {
    return;
  } else {
    previousProblems = newProblems;
  }

  var style = styles[type];
  var name = obj.name ? "'" + obj.name + "' " : '';
  var title = '[HMR] bundle ' + name + 'has ' + obj[type].length + ' ' + type;
  // NOTE: console.warn or console.error will print the stack trace
  // which isn't helpful here, so using console.log to escape it.
  if (console.group && console.groupEnd) {
    console.group('%c' + title, style);
    console.log('%c' + newProblems, style);
    console.groupEnd();
  } else {
    console.log(
      '%c' + title + '\n\t%c' + newProblems.replace(/\n/g, '\n\t'),
      style + 'font-weight: bold;',
      style + 'font-weight: normal;'
    );
  }
}

return {
  cleanProblemsCache: function () {
    previousProblems = null;
  },
  problems: function (type, obj) {
    if (options.warn) {
      log(type, obj);
    }
    if (overlay) {
      if (options.overlayWarnings || type === 'errors') {
        overlay.showProblems(type, obj[type]);
        return false;
      }
      overlay.clear();
    }
    return true;
  },
  success: function () {
    if (overlay) overlay.clear();
  },
  useCustomOverlay: function (customOverlay) {
    overlay = customOverlay;
  },
};
}

var processUpdate = __webpack_require__(/*! ./process-update */ "../process-update.js");

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
switch (obj.action) {
  case 'building':
    if (options.log) {
      console.log(
        '[HMR] bundle ' +
          (obj.name ? "'" + obj.name + "' " : '') +
          'rebuilding'
      );
    }
    break;
  case 'built':
    if (options.log) {
      console.log(
        '[HMR] bundle ' +
          (obj.name ? "'" + obj.name + "' " : '') +
          'rebuilt in ' +
          obj.time +
          'ms'
      );
    }
  // fall through
  case 'sync':
    if (obj.name && options.name && obj.name !== options.name) {
      return;
    }
    var applyUpdate = true;
    if (obj.errors.length > 0) {
      if (reporter) reporter.problems('errors', obj);
      applyUpdate = false;
    } else if (obj.warnings.length > 0) {
      if (reporter) {
        var overlayShown = reporter.problems('warnings', obj);
        applyUpdate = overlayShown;
      }
    } else {
      if (reporter) {
        reporter.cleanProblemsCache();
        reporter.success();
      }
    }
    if (applyUpdate) {
      processUpdate(obj.hash, obj.modules, options);
    }
    break;
  default:
    if (customHandler) {
      customHandler(obj);
    }
}

if (subscribeAllHandler) {
  subscribeAllHandler(obj);
}
}

if (module) {
module.exports = {
  subscribeAll: function subscribeAll(handler) {
    subscribeAllHandler = handler;
  },
  subscribe: function subscribe(handler) {
    customHandler = handler;
  },
  useCustomOverlay: function useCustomOverlay(customOverlay) {
    if (reporter) reporter.useCustomOverlay(customOverlay);
  },
  setOptionsAndConnect: setOptionsAndConnect,
};
}

/* WEBPACK VAR INJECTION */}.call(this, "?path=/__webpack_hmr&timeout=20000", __webpack_require__(/*! ./example/node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../node_modules/ansi-html/index.js":
/*!******************************************!*\
!*** ../node_modules/ansi-html/index.js ***!
\******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
black: '000',
red: 'ff0000',
green: '209805',
yellow: 'e8bf03',
blue: '0000ff',
magenta: 'ff00ff',
cyan: '00ffee',
lightgrey: 'f0f0f0',
darkgrey: '888'
}
var _styles = {
30: 'black',
31: 'red',
32: 'green',
33: 'yellow',
34: 'blue',
35: 'magenta',
36: 'cyan',
37: 'lightgrey'
}
var _openTags = {
'1': 'font-weight:bold', // bold
'2': 'opacity:0.5', // dim
'3': '<i>', // italic
'4': '<u>', // underscore
'8': 'display:none', // hidden
'9': '<del>' // delete
}
var _closeTags = {
'23': '</i>', // reset italic
'24': '</u>', // reset underscore
'29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
_closeTags[n] = '</span>'
})

/**
* Converts text with ANSI color codes to HTML markup.
* @param {String} text
* @returns {*}
*/
function ansiHTML (text) {
// Returns the text if the string has no ANSI escape code.
if (!_regANSI.test(text)) {
  return text
}

// Cache opened sequence.
var ansiCodes = []
// Replace with markup.
var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
  var ot = _openTags[seq]
  if (ot) {
    // If current sequence has been opened, close it.
    if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
      ansiCodes.pop()
      return '</span>'
    }
    // Open tag.
    ansiCodes.push(seq)
    return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
  }

  var ct = _closeTags[seq]
  if (ct) {
    // Pop sequence
    ansiCodes.pop()
    return ct
  }
  return ''
})

// Make sure tags are closed.
var l = ansiCodes.length
;(l > 0) && (ret += Array(l + 1).join('</span>'))

return ret
}

/**
* Customize colors.
* @param {Object} colors reference to _defColors
*/
ansiHTML.setColors = function (colors) {
if (typeof colors !== 'object') {
  throw new Error('`colors` parameter must be an Object.')
}

var _finalColors = {}
for (var key in _defColors) {
  var hex = colors.hasOwnProperty(key) ? colors[key] : null
  if (!hex) {
    _finalColors[key] = _defColors[key]
    continue
  }
  if ('reset' === key) {
    if (typeof hex === 'string') {
      hex = [hex]
    }
    if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
      return typeof h !== 'string'
    })) {
      throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
    }
    var defHexColor = _defColors[key]
    if (!hex[0]) {
      hex[0] = defHexColor[0]
    }
    if (hex.length === 1 || !hex[1]) {
      hex = [hex[0]]
      hex.push(defHexColor[1])
    }

    hex = hex.slice(0, 2)
  } else if (typeof hex !== 'string') {
    throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
  }
  _finalColors[key] = hex
}
_setTags(_finalColors)
}

/**
* Reset colors.
*/
ansiHTML.reset = function () {
_setTags(_defColors)
}

/**
* Expose tags, including open and close.
* @type {Object}
*/
ansiHTML.tags = {}

if (Object.defineProperty) {
Object.defineProperty(ansiHTML.tags, 'open', {
  get: function () { return _openTags }
})
Object.defineProperty(ansiHTML.tags, 'close', {
  get: function () { return _closeTags }
})
} else {
ansiHTML.tags.open = _openTags
ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
// reset all
_openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
// inverse
_openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
// dark grey
_openTags['90'] = 'color:#' + colors.darkgrey

for (var code in _styles) {
  var color = _styles[code]
  var oriColor = colors[color] || '000'
  _openTags[code] = 'color:#' + oriColor
  code = parseInt(code)
  _openTags[(code + 10).toString()] = 'background:#' + oriColor
}
}

ansiHTML.reset()


/***/ }),

/***/ "../node_modules/ansi-regex/index.js":
/*!*******************************************!*\
!*** ../node_modules/ansi-regex/index.js ***!
\*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ({onlyFirst = false} = {}) => {
  const pattern = [
      '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
      '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
  ].join('|');

  return new RegExp(pattern, onlyFirst ? undefined : 'g');
};


/***/ }),

/***/ "../node_modules/html-entities/lib/index.js":
/*!**************************************************!*\
!*** ../node_modules/html-entities/lib/index.js ***!
\**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var named_references_1 = __webpack_require__(/*! ./named-references */ "../node_modules/html-entities/lib/named-references.js");
var numeric_unicode_map_1 = __webpack_require__(/*! ./numeric-unicode-map */ "../node_modules/html-entities/lib/numeric-unicode-map.js");
var surrogate_pairs_1 = __webpack_require__(/*! ./surrogate-pairs */ "../node_modules/html-entities/lib/surrogate-pairs.js");
var allNamedReferences = __assign(__assign({}, named_references_1.namedReferences), { all: named_references_1.namedReferences.html5 });
var encodeRegExps = {
  specialChars: /[<>'"&]/g,
  nonAscii: /(?:[<>'"&\u0080-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g,
  nonAsciiPrintable: /(?:[<>'"&\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g,
  extensive: /(?:[\x01-\x0c\x0e-\x1f\x21-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7d\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g
};
var defaultEncodeOptions = {
  mode: 'specialChars',
  level: 'all',
  numeric: 'decimal'
};
function encode(text, _a) {
  var _b = _a === void 0 ? defaultEncodeOptions : _a, _c = _b.mode, mode = _c === void 0 ? 'specialChars' : _c, _d = _b.numeric, numeric = _d === void 0 ? 'decimal' : _d, _e = _b.level, level = _e === void 0 ? 'all' : _e;
  if (!text) {
      return '';
  }
  var references = allNamedReferences[level].characters;
  var isHex = numeric === 'hexadecimal';
  return text.replace(encodeRegExps[mode], function (input) {
      var entity = references[input];
      if (entity) {
          return entity;
      }
      var code = input.length > 1 ? surrogate_pairs_1.getCodePoint(input, 0) : input.charCodeAt(0);
      return (isHex ? '&#x' + code.toString(16) : '&#' + code) + ';';
  });
}
exports.encode = encode;
var defaultDecodeOptions = {
  scope: 'body',
  level: 'all'
};
var strict = /&(?:#\d+|#x[\da-fA-F]+|[0-9a-zA-Z]+);/g;
var attribute = /&(?:#\d+|#x[\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g;
var baseDecodeRegExps = {
  xml: {
      strict: strict,
      attribute: attribute,
      body: named_references_1.bodyRegExps.xml
  },
  html4: {
      strict: strict,
      attribute: attribute,
      body: named_references_1.bodyRegExps.html4
  },
  html5: {
      strict: strict,
      attribute: attribute,
      body: named_references_1.bodyRegExps.html5
  }
};
var decodeRegExps = __assign(__assign({}, baseDecodeRegExps), { all: baseDecodeRegExps.html5 });
var fromCharCode = String.fromCharCode;
var outOfBoundsChar = fromCharCode(65533);
function decode(text, _a) {
  var _b = _a === void 0 ? defaultDecodeOptions : _a, _c = _b.level, level = _c === void 0 ? 'all' : _c, _d = _b.scope, scope = _d === void 0 ? level === 'xml' ? 'strict' : 'body' : _d;
  if (!text) {
      return '';
  }
  var references = allNamedReferences[level].entities;
  var isAttribute = scope === 'attribute';
  return text.replace(decodeRegExps[level][scope], function (entity) {
      if (isAttribute && entity[entity.length - 1] === '=') {
          return entity;
      }
      if (entity[1] != '#') {
          return references[entity] || entity;
      }
      var secondChar = entity[2];
      var code = secondChar == 'x' || secondChar == 'X' ? parseInt(entity.substr(3), 16) : parseInt(entity.substr(2));
      return code >= 0x10ffff
          ? outOfBoundsChar
          : code > 65535
              ? surrogate_pairs_1.fromCodePoint(code)
              : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[code] || code);
  });
}
exports.decode = decode;


/***/ }),

/***/ "../node_modules/html-entities/lib/named-references.js":
/*!*************************************************************!*\
!*** ../node_modules/html-entities/lib/named-references.js ***!
\*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// This file is autogenerated by tools/process-named-references.ts
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyRegExps = {
  xml: /&(?:#\d+|#x[\da-fA-F]+|[0-9a-zA-Z]+);?/g,
  html4: /&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#x[\da-fA-F]+|[0-9a-zA-Z]+);?/g,
  html5: /&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#x[\da-fA-F]+|[0-9a-zA-Z]+);?/g
};
exports.namedReferences = {
  "xml": {
      "entities": {
          "&lt;": "<",
          "&gt;": ">",
          "&quot;": "\"",
          "&apos;": "'",
          "&amp;": "&"
      },
      "characters": {
          "<": "&lt;",
          ">": "&gt;",
          "\"": "&quot;",
          "'": "&apos;",
          "&": "&amp;"
      }
  },
  "html4": {
      "entities": {
          "&apos;": "'",
          "&nbsp": " ",
          "&nbsp;": " ",
          "&iexcl": "¡",
          "&iexcl;": "¡",
          "&cent": "¢",
          "&cent;": "¢",
          "&pound": "£",
          "&pound;": "£",
          "&curren": "¤",
          "&curren;": "¤",
          "&yen": "¥",
          "&yen;": "¥",
          "&brvbar": "¦",
          "&brvbar;": "¦",
          "&sect": "§",
          "&sect;": "§",
          "&uml": "¨",
          "&uml;": "¨",
          "&copy": "©",
          "&copy;": "©",
          "&ordf": "ª",
          "&ordf;": "ª",
          "&laquo": "«",
          "&laquo;": "«",
          "&not": "¬",
          "&not;": "¬",
          "&shy": "­",
          "&shy;": "­",
          "&reg": "®",
          "&reg;": "®",
          "&macr": "¯",
          "&macr;": "¯",
          "&deg": "°",
          "&deg;": "°",
          "&plusmn": "±",
          "&plusmn;": "±",
          "&sup2": "²",
          "&sup2;": "²",
          "&sup3": "³",
          "&sup3;": "³",
          "&acute": "´",
          "&acute;": "´",
          "&micro": "µ",
          "&micro;": "µ",
          "&para": "¶",
          "&para;": "¶",
          "&middot": "·",
          "&middot;": "·",
          "&cedil": "¸",
          "&cedil;": "¸",
          "&sup1": "¹",
          "&sup1;": "¹",
          "&ordm": "º",
          "&ordm;": "º",
          "&raquo": "»",
          "&raquo;": "»",
          "&frac14": "¼",
          "&frac14;": "¼",
          "&frac12": "½",
          "&frac12;": "½",
          "&frac34": "¾",
          "&frac34;": "¾",
          "&iquest": "¿",
          "&iquest;": "¿",
          "&Agrave": "À",
          "&Agrave;": "À",
          "&Aacute": "Á",
          "&Aacute;": "Á",
          "&Acirc": "Â",
          "&Acirc;": "Â",
          "&Atilde": "Ã",
          "&Atilde;": "Ã",
          "&Auml": "Ä",
          "&Auml;": "Ä",
          "&Aring": "Å",
          "&Aring;": "Å",
          "&AElig": "Æ",
          "&AElig;": "Æ",
          "&Ccedil": "Ç",
          "&Ccedil;": "Ç",
          "&Egrave": "È",
          "&Egrave;": "È",
          "&Eacute": "É",
          "&Eacute;": "É",
          "&Ecirc": "Ê",
          "&Ecirc;": "Ê",
          "&Euml": "Ë",
          "&Euml;": "Ë",
          "&Igrave": "Ì",
          "&Igrave;": "Ì",
          "&Iacute": "Í",
          "&Iacute;": "Í",
          "&Icirc": "Î",
          "&Icirc;": "Î",
          "&Iuml": "Ï",
          "&Iuml;": "Ï",
          "&ETH": "Ð",
          "&ETH;": "Ð",
          "&Ntilde": "Ñ",
          "&Ntilde;": "Ñ",
          "&Ograve": "Ò",
          "&Ograve;": "Ò",
          "&Oacute": "Ó",
          "&Oacute;": "Ó",
          "&Ocirc": "Ô",
          "&Ocirc;": "Ô",
          "&Otilde": "Õ",
          "&Otilde;": "Õ",
          "&Ouml": "Ö",
          "&Ouml;": "Ö",
          "&times": "×",
          "&times;": "×",
          "&Oslash": "Ø",
          "&Oslash;": "Ø",
          "&Ugrave": "Ù",
          "&Ugrave;": "Ù",
          "&Uacute": "Ú",
          "&Uacute;": "Ú",
          "&Ucirc": "Û",
          "&Ucirc;": "Û",
          "&Uuml": "Ü",
          "&Uuml;": "Ü",
          "&Yacute": "Ý",
          "&Yacute;": "Ý",
          "&THORN": "Þ",
          "&THORN;": "Þ",
          "&szlig": "ß",
          "&szlig;": "ß",
          "&agrave": "à",
          "&agrave;": "à",
          "&aacute": "á",
          "&aacute;": "á",
          "&acirc": "â",
          "&acirc;": "â",
          "&atilde": "ã",
          "&atilde;": "ã",
          "&auml": "ä",
          "&auml;": "ä",
          "&aring": "å",
          "&aring;": "å",
          "&aelig": "æ",
          "&aelig;": "æ",
          "&ccedil": "ç",
          "&ccedil;": "ç",
          "&egrave": "è",
          "&egrave;": "è",
          "&eacute": "é",
          "&eacute;": "é",
          "&ecirc": "ê",
          "&ecirc;": "ê",
          "&euml": "ë",
          "&euml;": "ë",
          "&igrave": "ì",
          "&igrave;": "ì",
          "&iacute": "í",
          "&iacute;": "í",
          "&icirc": "î",
          "&icirc;": "î",
          "&iuml": "ï",
          "&iuml;": "ï",
          "&eth": "ð",
          "&eth;": "ð",
          "&ntilde": "ñ",
          "&ntilde;": "ñ",
          "&ograve": "ò",
          "&ograve;": "ò",
          "&oacute": "ó",
          "&oacute;": "ó",
          "&ocirc": "ô",
          "&ocirc;": "ô",
          "&otilde": "õ",
          "&otilde;": "õ",
          "&ouml": "ö",
          "&ouml;": "ö",
          "&divide": "÷",
          "&divide;": "÷",
          "&oslash": "ø",
          "&oslash;": "ø",
          "&ugrave": "ù",
          "&ugrave;": "ù",
          "&uacute": "ú",
          "&uacute;": "ú",
          "&ucirc": "û",
          "&ucirc;": "û",
          "&uuml": "ü",
          "&uuml;": "ü",
          "&yacute": "ý",
          "&yacute;": "ý",
          "&thorn": "þ",
          "&thorn;": "þ",
          "&yuml": "ÿ",
          "&yuml;": "ÿ",
          "&quot": "\"",
          "&quot;": "\"",
          "&amp": "&",
          "&amp;": "&",
          "&lt": "<",
          "&lt;": "<",
          "&gt": ">",
          "&gt;": ">",
          "&OElig;": "Œ",
          "&oelig;": "œ",
          "&Scaron;": "Š",
          "&scaron;": "š",
          "&Yuml;": "Ÿ",
          "&circ;": "ˆ",
          "&tilde;": "˜",
          "&ensp;": " ",
          "&emsp;": " ",
          "&thinsp;": " ",
          "&zwnj;": "‌",
          "&zwj;": "‍",
          "&lrm;": "‎",
          "&rlm;": "‏",
          "&ndash;": "–",
          "&mdash;": "—",
          "&lsquo;": "‘",
          "&rsquo;": "’",
          "&sbquo;": "‚",
          "&ldquo;": "“",
          "&rdquo;": "”",
          "&bdquo;": "„",
          "&dagger;": "†",
          "&Dagger;": "‡",
          "&permil;": "‰",
          "&lsaquo;": "‹",
          "&rsaquo;": "›",
          "&euro;": "€",
          "&fnof;": "ƒ",
          "&Alpha;": "Α",
          "&Beta;": "Β",
          "&Gamma;": "Γ",
          "&Delta;": "Δ",
          "&Epsilon;": "Ε",
          "&Zeta;": "Ζ",
          "&Eta;": "Η",
          "&Theta;": "Θ",
          "&Iota;": "Ι",
          "&Kappa;": "Κ",
          "&Lambda;": "Λ",
          "&Mu;": "Μ",
          "&Nu;": "Ν",
          "&Xi;": "Ξ",
          "&Omicron;": "Ο",
          "&Pi;": "Π",
          "&Rho;": "Ρ",
          "&Sigma;": "Σ",
          "&Tau;": "Τ",
          "&Upsilon;": "Υ",
          "&Phi;": "Φ",
          "&Chi;": "Χ",
          "&Psi;": "Ψ",
          "&Omega;": "Ω",
          "&alpha;": "α",
          "&beta;": "β",
          "&gamma;": "γ",
          "&delta;": "δ",
          "&epsilon;": "ε",
          "&zeta;": "ζ",
          "&eta;": "η",
          "&theta;": "θ",
          "&iota;": "ι",
          "&kappa;": "κ",
          "&lambda;": "λ",
          "&mu;": "μ",
          "&nu;": "ν",
          "&xi;": "ξ",
          "&omicron;": "ο",
          "&pi;": "π",
          "&rho;": "ρ",
          "&sigmaf;": "ς",
          "&sigma;": "σ",
          "&tau;": "τ",
          "&upsilon;": "υ",
          "&phi;": "φ",
          "&chi;": "χ",
          "&psi;": "ψ",
          "&omega;": "ω",
          "&thetasym;": "ϑ",
          "&upsih;": "ϒ",
          "&piv;": "ϖ",
          "&bull;": "•",
          "&hellip;": "…",
          "&prime;": "′",
          "&Prime;": "″",
          "&oline;": "‾",
          "&frasl;": "⁄",
          "&weierp;": "℘",
          "&image;": "ℑ",
          "&real;": "ℜ",
          "&trade;": "™",
          "&alefsym;": "ℵ",
          "&larr;": "←",
          "&uarr;": "↑",
          "&rarr;": "→",
          "&darr;": "↓",
          "&harr;": "↔",
          "&crarr;": "↵",
          "&lArr;": "⇐",
          "&uArr;": "⇑",
          "&rArr;": "⇒",
          "&dArr;": "⇓",
          "&hArr;": "⇔",
          "&forall;": "∀",
          "&part;": "∂",
          "&exist;": "∃",
          "&empty;": "∅",
          "&nabla;": "∇",
          "&isin;": "∈",
          "&notin;": "∉",
          "&ni;": "∋",
          "&prod;": "∏",
          "&sum;": "∑",
          "&minus;": "−",
          "&lowast;": "∗",
          "&radic;": "√",
          "&prop;": "∝",
          "&infin;": "∞",
          "&ang;": "∠",
          "&and;": "∧",
          "&or;": "∨",
          "&cap;": "∩",
          "&cup;": "∪",
          "&int;": "∫",
          "&there4;": "∴",
          "&sim;": "∼",
          "&cong;": "≅",
          "&asymp;": "≈",
          "&ne;": "≠",
          "&equiv;": "≡",
          "&le;": "≤",
          "&ge;": "≥",
          "&sub;": "⊂",
          "&sup;": "⊃",
          "&nsub;": "⊄",
          "&sube;": "⊆",
          "&supe;": "⊇",
          "&oplus;": "⊕",
          "&otimes;": "⊗",
          "&perp;": "⊥",
          "&sdot;": "⋅",
          "&lceil;": "⌈",
          "&rceil;": "⌉",
          "&lfloor;": "⌊",
          "&rfloor;": "⌋",
          "&lang;": "〈",
          "&rang;": "〉",
          "&loz;": "◊",
          "&spades;": "♠",
          "&clubs;": "♣",
          "&hearts;": "♥",
          "&diams;": "♦"
      },
      "characters": {
          "'": "&apos;",
          " ": "&nbsp;",
          "¡": "&iexcl;",
          "¢": "&cent;",
          "£": "&pound;",
          "¤": "&curren;",
          "¥": "&yen;",
          "¦": "&brvbar;",
          "§": "&sect;",
          "¨": "&uml;",
          "©": "&copy;",
          "ª": "&ordf;",
          "«": "&laquo;",
          "¬": "&not;",
          "­": "&shy;",
          "®": "&reg;",
          "¯": "&macr;",
          "°": "&deg;",
          "±": "&plusmn;",
          "²": "&sup2;",
          "³": "&sup3;",
          "´": "&acute;",
          "µ": "&micro;",
          "¶": "&para;",
          "·": "&middot;",
          "¸": "&cedil;",
          "¹": "&sup1;",
          "º": "&ordm;",
          "»": "&raquo;",
          "¼": "&frac14;",
          "½": "&frac12;",
          "¾": "&frac34;",
          "¿": "&iquest;",
          "À": "&Agrave;",
          "Á": "&Aacute;",
          "Â": "&Acirc;",
          "Ã": "&Atilde;",
          "Ä": "&Auml;",
          "Å": "&Aring;",
          "Æ": "&AElig;",
          "Ç": "&Ccedil;",
          "È": "&Egrave;",
          "É": "&Eacute;",
          "Ê": "&Ecirc;",
          "Ë": "&Euml;",
          "Ì": "&Igrave;",
          "Í": "&Iacute;",
          "Î": "&Icirc;",
          "Ï": "&Iuml;",
          "Ð": "&ETH;",
          "Ñ": "&Ntilde;",
          "Ò": "&Ograve;",
          "Ó": "&Oacute;",
          "Ô": "&Ocirc;",
          "Õ": "&Otilde;",
          "Ö": "&Ouml;",
          "×": "&times;",
          "Ø": "&Oslash;",
          "Ù": "&Ugrave;",
          "Ú": "&Uacute;",
          "Û": "&Ucirc;",
          "Ü": "&Uuml;",
          "Ý": "&Yacute;",
          "Þ": "&THORN;",
          "ß": "&szlig;",
          "à": "&agrave;",
          "á": "&aacute;",
          "â": "&acirc;",
          "ã": "&atilde;",
          "ä": "&auml;",
          "å": "&aring;",
          "æ": "&aelig;",
          "ç": "&ccedil;",
          "è": "&egrave;",
          "é": "&eacute;",
          "ê": "&ecirc;",
          "ë": "&euml;",
          "ì": "&igrave;",
          "í": "&iacute;",
          "î": "&icirc;",
          "ï": "&iuml;",
          "ð": "&eth;",
          "ñ": "&ntilde;",
          "ò": "&ograve;",
          "ó": "&oacute;",
          "ô": "&ocirc;",
          "õ": "&otilde;",
          "ö": "&ouml;",
          "÷": "&divide;",
          "ø": "&oslash;",
          "ù": "&ugrave;",
          "ú": "&uacute;",
          "û": "&ucirc;",
          "ü": "&uuml;",
          "ý": "&yacute;",
          "þ": "&thorn;",
          "ÿ": "&yuml;",
          "\"": "&quot;",
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "Œ": "&OElig;",
          "œ": "&oelig;",
          "Š": "&Scaron;",
          "š": "&scaron;",
          "Ÿ": "&Yuml;",
          "ˆ": "&circ;",
          "˜": "&tilde;",
          " ": "&ensp;",
          " ": "&emsp;",
          " ": "&thinsp;",
          "‌": "&zwnj;",
          "‍": "&zwj;",
          "‎": "&lrm;",
          "‏": "&rlm;",
          "–": "&ndash;",
          "—": "&mdash;",
          "‘": "&lsquo;",
          "’": "&rsquo;",
          "‚": "&sbquo;",
          "“": "&ldquo;",
          "”": "&rdquo;",
          "„": "&bdquo;",
          "†": "&dagger;",
          "‡": "&Dagger;",
          "‰": "&permil;",
          "‹": "&lsaquo;",
          "›": "&rsaquo;",
          "€": "&euro;",
          "ƒ": "&fnof;",
          "Α": "&Alpha;",
          "Β": "&Beta;",
          "Γ": "&Gamma;",
          "Δ": "&Delta;",
          "Ε": "&Epsilon;",
          "Ζ": "&Zeta;",
          "Η": "&Eta;",
          "Θ": "&Theta;",
          "Ι": "&Iota;",
          "Κ": "&Kappa;",
          "Λ": "&Lambda;",
          "Μ": "&Mu;",
          "Ν": "&Nu;",
          "Ξ": "&Xi;",
          "Ο": "&Omicron;",
          "Π": "&Pi;",
          "Ρ": "&Rho;",
          "Σ": "&Sigma;",
          "Τ": "&Tau;",
          "Υ": "&Upsilon;",
          "Φ": "&Phi;",
          "Χ": "&Chi;",
          "Ψ": "&Psi;",
          "Ω": "&Omega;",
          "α": "&alpha;",
          "β": "&beta;",
          "γ": "&gamma;",
          "δ": "&delta;",
          "ε": "&epsilon;",
          "ζ": "&zeta;",
          "η": "&eta;",
          "θ": "&theta;",
          "ι": "&iota;",
          "κ": "&kappa;",
          "λ": "&lambda;",
          "μ": "&mu;",
          "ν": "&nu;",
          "ξ": "&xi;",
          "ο": "&omicron;",
          "π": "&pi;",
          "ρ": "&rho;",
          "ς": "&sigmaf;",
          "σ": "&sigma;",
          "τ": "&tau;",
          "υ": "&upsilon;",
          "φ": "&phi;",
          "χ": "&chi;",
          "ψ": "&psi;",
          "ω": "&omega;",
          "ϑ": "&thetasym;",
          "ϒ": "&upsih;",
          "ϖ": "&piv;",
          "•": "&bull;",
          "…": "&hellip;",
          "′": "&prime;",
          "″": "&Prime;",
          "‾": "&oline;",
          "⁄": "&frasl;",
          "℘": "&weierp;",
          "ℑ": "&image;",
          "ℜ": "&real;",
          "™": "&trade;",
          "ℵ": "&alefsym;",
          "←": "&larr;",
          "↑": "&uarr;",
          "→": "&rarr;",
          "↓": "&darr;",
          "↔": "&harr;",
          "↵": "&crarr;",
          "⇐": "&lArr;",
          "⇑": "&uArr;",
          "⇒": "&rArr;",
          "⇓": "&dArr;",
          "⇔": "&hArr;",
          "∀": "&forall;",
          "∂": "&part;",
          "∃": "&exist;",
          "∅": "&empty;",
          "∇": "&nabla;",
          "∈": "&isin;",
          "∉": "&notin;",
          "∋": "&ni;",
          "∏": "&prod;",
          "∑": "&sum;",
          "−": "&minus;",
          "∗": "&lowast;",
          "√": "&radic;",
          "∝": "&prop;",
          "∞": "&infin;",
          "∠": "&ang;",
          "∧": "&and;",
          "∨": "&or;",
          "∩": "&cap;",
          "∪": "&cup;",
          "∫": "&int;",
          "∴": "&there4;",
          "∼": "&sim;",
          "≅": "&cong;",
          "≈": "&asymp;",
          "≠": "&ne;",
          "≡": "&equiv;",
          "≤": "&le;",
          "≥": "&ge;",
          "⊂": "&sub;",
          "⊃": "&sup;",
          "⊄": "&nsub;",
          "⊆": "&sube;",
          "⊇": "&supe;",
          "⊕": "&oplus;",
          "⊗": "&otimes;",
          "⊥": "&perp;",
          "⋅": "&sdot;",
          "⌈": "&lceil;",
          "⌉": "&rceil;",
          "⌊": "&lfloor;",
          "⌋": "&rfloor;",
          "〈": "&lang;",
          "〉": "&rang;",
          "◊": "&loz;",
          "♠": "&spades;",
          "♣": "&clubs;",
          "♥": "&hearts;",
          "♦": "&diams;"
      }
  },
  "html5": {
      "entities": {
          "&AElig": "Æ",
          "&AElig;": "Æ",
          "&AMP": "&",
          "&AMP;": "&",
          "&Aacute": "Á",
          "&Aacute;": "Á",
          "&Abreve;": "Ă",
          "&Acirc": "Â",
          "&Acirc;": "Â",
          "&Acy;": "А",
          "&Afr;": "𝔄",
          "&Agrave": "À",
          "&Agrave;": "À",
          "&Alpha;": "Α",
          "&Amacr;": "Ā",
          "&And;": "⩓",
          "&Aogon;": "Ą",
          "&Aopf;": "𝔸",
          "&ApplyFunction;": "⁡",
          "&Aring": "Å",
          "&Aring;": "Å",
          "&Ascr;": "𝒜",
          "&Assign;": "≔",
          "&Atilde": "Ã",
          "&Atilde;": "Ã",
          "&Auml": "Ä",
          "&Auml;": "Ä",
          "&Backslash;": "∖",
          "&Barv;": "⫧",
          "&Barwed;": "⌆",
          "&Bcy;": "Б",
          "&Because;": "∵",
          "&Bernoullis;": "ℬ",
          "&Beta;": "Β",
          "&Bfr;": "𝔅",
          "&Bopf;": "𝔹",
          "&Breve;": "˘",
          "&Bscr;": "ℬ",
          "&Bumpeq;": "≎",
          "&CHcy;": "Ч",
          "&COPY": "©",
          "&COPY;": "©",
          "&Cacute;": "Ć",
          "&Cap;": "⋒",
          "&CapitalDifferentialD;": "ⅅ",
          "&Cayleys;": "ℭ",
          "&Ccaron;": "Č",
          "&Ccedil": "Ç",
          "&Ccedil;": "Ç",
          "&Ccirc;": "Ĉ",
          "&Cconint;": "∰",
          "&Cdot;": "Ċ",
          "&Cedilla;": "¸",
          "&CenterDot;": "·",
          "&Cfr;": "ℭ",
          "&Chi;": "Χ",
          "&CircleDot;": "⊙",
          "&CircleMinus;": "⊖",
          "&CirclePlus;": "⊕",
          "&CircleTimes;": "⊗",
          "&ClockwiseContourIntegral;": "∲",
          "&CloseCurlyDoubleQuote;": "”",
          "&CloseCurlyQuote;": "’",
          "&Colon;": "∷",
          "&Colone;": "⩴",
          "&Congruent;": "≡",
          "&Conint;": "∯",
          "&ContourIntegral;": "∮",
          "&Copf;": "ℂ",
          "&Coproduct;": "∐",
          "&CounterClockwiseContourIntegral;": "∳",
          "&Cross;": "⨯",
          "&Cscr;": "𝒞",
          "&Cup;": "⋓",
          "&CupCap;": "≍",
          "&DD;": "ⅅ",
          "&DDotrahd;": "⤑",
          "&DJcy;": "Ђ",
          "&DScy;": "Ѕ",
          "&DZcy;": "Џ",
          "&Dagger;": "‡",
          "&Darr;": "↡",
          "&Dashv;": "⫤",
          "&Dcaron;": "Ď",
          "&Dcy;": "Д",
          "&Del;": "∇",
          "&Delta;": "Δ",
          "&Dfr;": "𝔇",
          "&DiacriticalAcute;": "´",
          "&DiacriticalDot;": "˙",
          "&DiacriticalDoubleAcute;": "˝",
          "&DiacriticalGrave;": "`",
          "&DiacriticalTilde;": "˜",
          "&Diamond;": "⋄",
          "&DifferentialD;": "ⅆ",
          "&Dopf;": "𝔻",
          "&Dot;": "¨",
          "&DotDot;": "⃜",
          "&DotEqual;": "≐",
          "&DoubleContourIntegral;": "∯",
          "&DoubleDot;": "¨",
          "&DoubleDownArrow;": "⇓",
          "&DoubleLeftArrow;": "⇐",
          "&DoubleLeftRightArrow;": "⇔",
          "&DoubleLeftTee;": "⫤",
          "&DoubleLongLeftArrow;": "⟸",
          "&DoubleLongLeftRightArrow;": "⟺",
          "&DoubleLongRightArrow;": "⟹",
          "&DoubleRightArrow;": "⇒",
          "&DoubleRightTee;": "⊨",
          "&DoubleUpArrow;": "⇑",
          "&DoubleUpDownArrow;": "⇕",
          "&DoubleVerticalBar;": "∥",
          "&DownArrow;": "↓",
          "&DownArrowBar;": "⤓",
          "&DownArrowUpArrow;": "⇵",
          "&DownBreve;": "̑",
          "&DownLeftRightVector;": "⥐",
          "&DownLeftTeeVector;": "⥞",
          "&DownLeftVector;": "↽",
          "&DownLeftVectorBar;": "⥖",
          "&DownRightTeeVector;": "⥟",
          "&DownRightVector;": "⇁",
          "&DownRightVectorBar;": "⥗",
          "&DownTee;": "⊤",
          "&DownTeeArrow;": "↧",
          "&Downarrow;": "⇓",
          "&Dscr;": "𝒟",
          "&Dstrok;": "Đ",
          "&ENG;": "Ŋ",
          "&ETH": "Ð",
          "&ETH;": "Ð",
          "&Eacute": "É",
          "&Eacute;": "É",
          "&Ecaron;": "Ě",
          "&Ecirc": "Ê",
          "&Ecirc;": "Ê",
          "&Ecy;": "Э",
          "&Edot;": "Ė",
          "&Efr;": "𝔈",
          "&Egrave": "È",
          "&Egrave;": "È",
          "&Element;": "∈",
          "&Emacr;": "Ē",
          "&EmptySmallSquare;": "◻",
          "&EmptyVerySmallSquare;": "▫",
          "&Eogon;": "Ę",
          "&Eopf;": "𝔼",
          "&Epsilon;": "Ε",
          "&Equal;": "⩵",
          "&EqualTilde;": "≂",
          "&Equilibrium;": "⇌",
          "&Escr;": "ℰ",
          "&Esim;": "⩳",
          "&Eta;": "Η",
          "&Euml": "Ë",
          "&Euml;": "Ë",
          "&Exists;": "∃",
          "&ExponentialE;": "ⅇ",
          "&Fcy;": "Ф",
          "&Ffr;": "𝔉",
          "&FilledSmallSquare;": "◼",
          "&FilledVerySmallSquare;": "▪",
          "&Fopf;": "𝔽",
          "&ForAll;": "∀",
          "&Fouriertrf;": "ℱ",
          "&Fscr;": "ℱ",
          "&GJcy;": "Ѓ",
          "&GT": ">",
          "&GT;": ">",
          "&Gamma;": "Γ",
          "&Gammad;": "Ϝ",
          "&Gbreve;": "Ğ",
          "&Gcedil;": "Ģ",
          "&Gcirc;": "Ĝ",
          "&Gcy;": "Г",
          "&Gdot;": "Ġ",
          "&Gfr;": "𝔊",
          "&Gg;": "⋙",
          "&Gopf;": "𝔾",
          "&GreaterEqual;": "≥",
          "&GreaterEqualLess;": "⋛",
          "&GreaterFullEqual;": "≧",
          "&GreaterGreater;": "⪢",
          "&GreaterLess;": "≷",
          "&GreaterSlantEqual;": "⩾",
          "&GreaterTilde;": "≳",
          "&Gscr;": "𝒢",
          "&Gt;": "≫",
          "&HARDcy;": "Ъ",
          "&Hacek;": "ˇ",
          "&Hat;": "^",
          "&Hcirc;": "Ĥ",
          "&Hfr;": "ℌ",
          "&HilbertSpace;": "ℋ",
          "&Hopf;": "ℍ",
          "&HorizontalLine;": "─",
          "&Hscr;": "ℋ",
          "&Hstrok;": "Ħ",
          "&HumpDownHump;": "≎",
          "&HumpEqual;": "≏",
          "&IEcy;": "Е",
          "&IJlig;": "Ĳ",
          "&IOcy;": "Ё",
          "&Iacute": "Í",
          "&Iacute;": "Í",
          "&Icirc": "Î",
          "&Icirc;": "Î",
          "&Icy;": "И",
          "&Idot;": "İ",
          "&Ifr;": "ℑ",
          "&Igrave": "Ì",
          "&Igrave;": "Ì",
          "&Im;": "ℑ",
          "&Imacr;": "Ī",
          "&ImaginaryI;": "ⅈ",
          "&Implies;": "⇒",
          "&Int;": "∬",
          "&Integral;": "∫",
          "&Intersection;": "⋂",
          "&InvisibleComma;": "⁣",
          "&InvisibleTimes;": "⁢",
          "&Iogon;": "Į",
          "&Iopf;": "𝕀",
          "&Iota;": "Ι",
          "&Iscr;": "ℐ",
          "&Itilde;": "Ĩ",
          "&Iukcy;": "І",
          "&Iuml": "Ï",
          "&Iuml;": "Ï",
          "&Jcirc;": "Ĵ",
          "&Jcy;": "Й",
          "&Jfr;": "𝔍",
          "&Jopf;": "𝕁",
          "&Jscr;": "𝒥",
          "&Jsercy;": "Ј",
          "&Jukcy;": "Є",
          "&KHcy;": "Х",
          "&KJcy;": "Ќ",
          "&Kappa;": "Κ",
          "&Kcedil;": "Ķ",
          "&Kcy;": "К",
          "&Kfr;": "𝔎",
          "&Kopf;": "𝕂",
          "&Kscr;": "𝒦",
          "&LJcy;": "Љ",
          "&LT": "<",
          "&LT;": "<",
          "&Lacute;": "Ĺ",
          "&Lambda;": "Λ",
          "&Lang;": "⟪",
          "&Laplacetrf;": "ℒ",
          "&Larr;": "↞",
          "&Lcaron;": "Ľ",
          "&Lcedil;": "Ļ",
          "&Lcy;": "Л",
          "&LeftAngleBracket;": "⟨",
          "&LeftArrow;": "←",
          "&LeftArrowBar;": "⇤",
          "&LeftArrowRightArrow;": "⇆",
          "&LeftCeiling;": "⌈",
          "&LeftDoubleBracket;": "⟦",
          "&LeftDownTeeVector;": "⥡",
          "&LeftDownVector;": "⇃",
          "&LeftDownVectorBar;": "⥙",
          "&LeftFloor;": "⌊",
          "&LeftRightArrow;": "↔",
          "&LeftRightVector;": "⥎",
          "&LeftTee;": "⊣",
          "&LeftTeeArrow;": "↤",
          "&LeftTeeVector;": "⥚",
          "&LeftTriangle;": "⊲",
          "&LeftTriangleBar;": "⧏",
          "&LeftTriangleEqual;": "⊴",
          "&LeftUpDownVector;": "⥑",
          "&LeftUpTeeVector;": "⥠",
          "&LeftUpVector;": "↿",
          "&LeftUpVectorBar;": "⥘",
          "&LeftVector;": "↼",
          "&LeftVectorBar;": "⥒",
          "&Leftarrow;": "⇐",
          "&Leftrightarrow;": "⇔",
          "&LessEqualGreater;": "⋚",
          "&LessFullEqual;": "≦",
          "&LessGreater;": "≶",
          "&LessLess;": "⪡",
          "&LessSlantEqual;": "⩽",
          "&LessTilde;": "≲",
          "&Lfr;": "𝔏",
          "&Ll;": "⋘",
          "&Lleftarrow;": "⇚",
          "&Lmidot;": "Ŀ",
          "&LongLeftArrow;": "⟵",
          "&LongLeftRightArrow;": "⟷",
          "&LongRightArrow;": "⟶",
          "&Longleftarrow;": "⟸",
          "&Longleftrightarrow;": "⟺",
          "&Longrightarrow;": "⟹",
          "&Lopf;": "𝕃",
          "&LowerLeftArrow;": "↙",
          "&LowerRightArrow;": "↘",
          "&Lscr;": "ℒ",
          "&Lsh;": "↰",
          "&Lstrok;": "Ł",
          "&Lt;": "≪",
          "&Map;": "⤅",
          "&Mcy;": "М",
          "&MediumSpace;": " ",
          "&Mellintrf;": "ℳ",
          "&Mfr;": "𝔐",
          "&MinusPlus;": "∓",
          "&Mopf;": "𝕄",
          "&Mscr;": "ℳ",
          "&Mu;": "Μ",
          "&NJcy;": "Њ",
          "&Nacute;": "Ń",
          "&Ncaron;": "Ň",
          "&Ncedil;": "Ņ",
          "&Ncy;": "Н",
          "&NegativeMediumSpace;": "​",
          "&NegativeThickSpace;": "​",
          "&NegativeThinSpace;": "​",
          "&NegativeVeryThinSpace;": "​",
          "&NestedGreaterGreater;": "≫",
          "&NestedLessLess;": "≪",
          "&NewLine;": "\n",
          "&Nfr;": "𝔑",
          "&NoBreak;": "⁠",
          "&NonBreakingSpace;": " ",
          "&Nopf;": "ℕ",
          "&Not;": "⫬",
          "&NotCongruent;": "≢",
          "&NotCupCap;": "≭",
          "&NotDoubleVerticalBar;": "∦",
          "&NotElement;": "∉",
          "&NotEqual;": "≠",
          "&NotEqualTilde;": "≂̸",
          "&NotExists;": "∄",
          "&NotGreater;": "≯",
          "&NotGreaterEqual;": "≱",
          "&NotGreaterFullEqual;": "≧̸",
          "&NotGreaterGreater;": "≫̸",
          "&NotGreaterLess;": "≹",
          "&NotGreaterSlantEqual;": "⩾̸",
          "&NotGreaterTilde;": "≵",
          "&NotHumpDownHump;": "≎̸",
          "&NotHumpEqual;": "≏̸",
          "&NotLeftTriangle;": "⋪",
          "&NotLeftTriangleBar;": "⧏̸",
          "&NotLeftTriangleEqual;": "⋬",
          "&NotLess;": "≮",
          "&NotLessEqual;": "≰",
          "&NotLessGreater;": "≸",
          "&NotLessLess;": "≪̸",
          "&NotLessSlantEqual;": "⩽̸",
          "&NotLessTilde;": "≴",
          "&NotNestedGreaterGreater;": "⪢̸",
          "&NotNestedLessLess;": "⪡̸",
          "&NotPrecedes;": "⊀",
          "&NotPrecedesEqual;": "⪯̸",
          "&NotPrecedesSlantEqual;": "⋠",
          "&NotReverseElement;": "∌",
          "&NotRightTriangle;": "⋫",
          "&NotRightTriangleBar;": "⧐̸",
          "&NotRightTriangleEqual;": "⋭",
          "&NotSquareSubset;": "⊏̸",
          "&NotSquareSubsetEqual;": "⋢",
          "&NotSquareSuperset;": "⊐̸",
          "&NotSquareSupersetEqual;": "⋣",
          "&NotSubset;": "⊂⃒",
          "&NotSubsetEqual;": "⊈",
          "&NotSucceeds;": "⊁",
          "&NotSucceedsEqual;": "⪰̸",
          "&NotSucceedsSlantEqual;": "⋡",
          "&NotSucceedsTilde;": "≿̸",
          "&NotSuperset;": "⊃⃒",
          "&NotSupersetEqual;": "⊉",
          "&NotTilde;": "≁",
          "&NotTildeEqual;": "≄",
          "&NotTildeFullEqual;": "≇",
          "&NotTildeTilde;": "≉",
          "&NotVerticalBar;": "∤",
          "&Nscr;": "𝒩",
          "&Ntilde": "Ñ",
          "&Ntilde;": "Ñ",
          "&Nu;": "Ν",
          "&OElig;": "Œ",
          "&Oacute": "Ó",
          "&Oacute;": "Ó",
          "&Ocirc": "Ô",
          "&Ocirc;": "Ô",
          "&Ocy;": "О",
          "&Odblac;": "Ő",
          "&Ofr;": "𝔒",
          "&Ograve": "Ò",
          "&Ograve;": "Ò",
          "&Omacr;": "Ō",
          "&Omega;": "Ω",
          "&Omicron;": "Ο",
          "&Oopf;": "𝕆",
          "&OpenCurlyDoubleQuote;": "“",
          "&OpenCurlyQuote;": "‘",
          "&Or;": "⩔",
          "&Oscr;": "𝒪",
          "&Oslash": "Ø",
          "&Oslash;": "Ø",
          "&Otilde": "Õ",
          "&Otilde;": "Õ",
          "&Otimes;": "⨷",
          "&Ouml": "Ö",
          "&Ouml;": "Ö",
          "&OverBar;": "‾",
          "&OverBrace;": "⏞",
          "&OverBracket;": "⎴",
          "&OverParenthesis;": "⏜",
          "&PartialD;": "∂",
          "&Pcy;": "П",
          "&Pfr;": "𝔓",
          "&Phi;": "Φ",
          "&Pi;": "Π",
          "&PlusMinus;": "±",
          "&Poincareplane;": "ℌ",
          "&Popf;": "ℙ",
          "&Pr;": "⪻",
          "&Precedes;": "≺",
          "&PrecedesEqual;": "⪯",
          "&PrecedesSlantEqual;": "≼",
          "&PrecedesTilde;": "≾",
          "&Prime;": "″",
          "&Product;": "∏",
          "&Proportion;": "∷",
          "&Proportional;": "∝",
          "&Pscr;": "𝒫",
          "&Psi;": "Ψ",
          "&QUOT": "\"",
          "&QUOT;": "\"",
          "&Qfr;": "𝔔",
          "&Qopf;": "ℚ",
          "&Qscr;": "𝒬",
          "&RBarr;": "⤐",
          "&REG": "®",
          "&REG;": "®",
          "&Racute;": "Ŕ",
          "&Rang;": "⟫",
          "&Rarr;": "↠",
          "&Rarrtl;": "⤖",
          "&Rcaron;": "Ř",
          "&Rcedil;": "Ŗ",
          "&Rcy;": "Р",
          "&Re;": "ℜ",
          "&ReverseElement;": "∋",
          "&ReverseEquilibrium;": "⇋",
          "&ReverseUpEquilibrium;": "⥯",
          "&Rfr;": "ℜ",
          "&Rho;": "Ρ",
          "&RightAngleBracket;": "⟩",
          "&RightArrow;": "→",
          "&RightArrowBar;": "⇥",
          "&RightArrowLeftArrow;": "⇄",
          "&RightCeiling;": "⌉",
          "&RightDoubleBracket;": "⟧",
          "&RightDownTeeVector;": "⥝",
          "&RightDownVector;": "⇂",
          "&RightDownVectorBar;": "⥕",
          "&RightFloor;": "⌋",
          "&RightTee;": "⊢",
          "&RightTeeArrow;": "↦",
          "&RightTeeVector;": "⥛",
          "&RightTriangle;": "⊳",
          "&RightTriangleBar;": "⧐",
          "&RightTriangleEqual;": "⊵",
          "&RightUpDownVector;": "⥏",
          "&RightUpTeeVector;": "⥜",
          "&RightUpVector;": "↾",
          "&RightUpVectorBar;": "⥔",
          "&RightVector;": "⇀",
          "&RightVectorBar;": "⥓",
          "&Rightarrow;": "⇒",
          "&Ropf;": "ℝ",
          "&RoundImplies;": "⥰",
          "&Rrightarrow;": "⇛",
          "&Rscr;": "ℛ",
          "&Rsh;": "↱",
          "&RuleDelayed;": "⧴",
          "&SHCHcy;": "Щ",
          "&SHcy;": "Ш",
          "&SOFTcy;": "Ь",
          "&Sacute;": "Ś",
          "&Sc;": "⪼",
          "&Scaron;": "Š",
          "&Scedil;": "Ş",
          "&Scirc;": "Ŝ",
          "&Scy;": "С",
          "&Sfr;": "𝔖",
          "&ShortDownArrow;": "↓",
          "&ShortLeftArrow;": "←",
          "&ShortRightArrow;": "→",
          "&ShortUpArrow;": "↑",
          "&Sigma;": "Σ",
          "&SmallCircle;": "∘",
          "&Sopf;": "𝕊",
          "&Sqrt;": "√",
          "&Square;": "□",
          "&SquareIntersection;": "⊓",
          "&SquareSubset;": "⊏",
          "&SquareSubsetEqual;": "⊑",
          "&SquareSuperset;": "⊐",
          "&SquareSupersetEqual;": "⊒",
          "&SquareUnion;": "⊔",
          "&Sscr;": "𝒮",
          "&Star;": "⋆",
          "&Sub;": "⋐",
          "&Subset;": "⋐",
          "&SubsetEqual;": "⊆",
          "&Succeeds;": "≻",
          "&SucceedsEqual;": "⪰",
          "&SucceedsSlantEqual;": "≽",
          "&SucceedsTilde;": "≿",
          "&SuchThat;": "∋",
          "&Sum;": "∑",
          "&Sup;": "⋑",
          "&Superset;": "⊃",
          "&SupersetEqual;": "⊇",
          "&Supset;": "⋑",
          "&THORN": "Þ",
          "&THORN;": "Þ",
          "&TRADE;": "™",
          "&TSHcy;": "Ћ",
          "&TScy;": "Ц",
          "&Tab;": "\t",
          "&Tau;": "Τ",
          "&Tcaron;": "Ť",
          "&Tcedil;": "Ţ",
          "&Tcy;": "Т",
          "&Tfr;": "𝔗",
          "&Therefore;": "∴",
          "&Theta;": "Θ",
          "&ThickSpace;": "  ",
          "&ThinSpace;": " ",
          "&Tilde;": "∼",
          "&TildeEqual;": "≃",
          "&TildeFullEqual;": "≅",
          "&TildeTilde;": "≈",
          "&Topf;": "𝕋",
          "&TripleDot;": "⃛",
          "&Tscr;": "𝒯",
          "&Tstrok;": "Ŧ",
          "&Uacute": "Ú",
          "&Uacute;": "Ú",
          "&Uarr;": "↟",
          "&Uarrocir;": "⥉",
          "&Ubrcy;": "Ў",
          "&Ubreve;": "Ŭ",
          "&Ucirc": "Û",
          "&Ucirc;": "Û",
          "&Ucy;": "У",
          "&Udblac;": "Ű",
          "&Ufr;": "𝔘",
          "&Ugrave": "Ù",
          "&Ugrave;": "Ù",
          "&Umacr;": "Ū",
          "&UnderBar;": "_",
          "&UnderBrace;": "⏟",
          "&UnderBracket;": "⎵",
          "&UnderParenthesis;": "⏝",
          "&Union;": "⋃",
          "&UnionPlus;": "⊎",
          "&Uogon;": "Ų",
          "&Uopf;": "𝕌",
          "&UpArrow;": "↑",
          "&UpArrowBar;": "⤒",
          "&UpArrowDownArrow;": "⇅",
          "&UpDownArrow;": "↕",
          "&UpEquilibrium;": "⥮",
          "&UpTee;": "⊥",
          "&UpTeeArrow;": "↥",
          "&Uparrow;": "⇑",
          "&Updownarrow;": "⇕",
          "&UpperLeftArrow;": "↖",
          "&UpperRightArrow;": "↗",
          "&Upsi;": "ϒ",
          "&Upsilon;": "Υ",
          "&Uring;": "Ů",
          "&Uscr;": "𝒰",
          "&Utilde;": "Ũ",
          "&Uuml": "Ü",
          "&Uuml;": "Ü",
          "&VDash;": "⊫",
          "&Vbar;": "⫫",
          "&Vcy;": "В",
          "&Vdash;": "⊩",
          "&Vdashl;": "⫦",
          "&Vee;": "⋁",
          "&Verbar;": "‖",
          "&Vert;": "‖",
          "&VerticalBar;": "∣",
          "&VerticalLine;": "|",
          "&VerticalSeparator;": "❘",
          "&VerticalTilde;": "≀",
          "&VeryThinSpace;": " ",
          "&Vfr;": "𝔙",
          "&Vopf;": "𝕍",
          "&Vscr;": "𝒱",
          "&Vvdash;": "⊪",
          "&Wcirc;": "Ŵ",
          "&Wedge;": "⋀",
          "&Wfr;": "𝔚",
          "&Wopf;": "𝕎",
          "&Wscr;": "𝒲",
          "&Xfr;": "𝔛",
          "&Xi;": "Ξ",
          "&Xopf;": "𝕏",
          "&Xscr;": "𝒳",
          "&YAcy;": "Я",
          "&YIcy;": "Ї",
          "&YUcy;": "Ю",
          "&Yacute": "Ý",
          "&Yacute;": "Ý",
          "&Ycirc;": "Ŷ",
          "&Ycy;": "Ы",
          "&Yfr;": "𝔜",
          "&Yopf;": "𝕐",
          "&Yscr;": "𝒴",
          "&Yuml;": "Ÿ",
          "&ZHcy;": "Ж",
          "&Zacute;": "Ź",
          "&Zcaron;": "Ž",
          "&Zcy;": "З",
          "&Zdot;": "Ż",
          "&ZeroWidthSpace;": "​",
          "&Zeta;": "Ζ",
          "&Zfr;": "ℨ",
          "&Zopf;": "ℤ",
          "&Zscr;": "𝒵",
          "&aacute": "á",
          "&aacute;": "á",
          "&abreve;": "ă",
          "&ac;": "∾",
          "&acE;": "∾̳",
          "&acd;": "∿",
          "&acirc": "â",
          "&acirc;": "â",
          "&acute": "´",
          "&acute;": "´",
          "&acy;": "а",
          "&aelig": "æ",
          "&aelig;": "æ",
          "&af;": "⁡",
          "&afr;": "𝔞",
          "&agrave": "à",
          "&agrave;": "à",
          "&alefsym;": "ℵ",
          "&aleph;": "ℵ",
          "&alpha;": "α",
          "&amacr;": "ā",
          "&amalg;": "⨿",
          "&amp": "&",
          "&amp;": "&",
          "&and;": "∧",
          "&andand;": "⩕",
          "&andd;": "⩜",
          "&andslope;": "⩘",
          "&andv;": "⩚",
          "&ang;": "∠",
          "&ange;": "⦤",
          "&angle;": "∠",
          "&angmsd;": "∡",
          "&angmsdaa;": "⦨",
          "&angmsdab;": "⦩",
          "&angmsdac;": "⦪",
          "&angmsdad;": "⦫",
          "&angmsdae;": "⦬",
          "&angmsdaf;": "⦭",
          "&angmsdag;": "⦮",
          "&angmsdah;": "⦯",
          "&angrt;": "∟",
          "&angrtvb;": "⊾",
          "&angrtvbd;": "⦝",
          "&angsph;": "∢",
          "&angst;": "Å",
          "&angzarr;": "⍼",
          "&aogon;": "ą",
          "&aopf;": "𝕒",
          "&ap;": "≈",
          "&apE;": "⩰",
          "&apacir;": "⩯",
          "&ape;": "≊",
          "&apid;": "≋",
          "&apos;": "'",
          "&approx;": "≈",
          "&approxeq;": "≊",
          "&aring": "å",
          "&aring;": "å",
          "&ascr;": "𝒶",
          "&ast;": "*",
          "&asymp;": "≈",
          "&asympeq;": "≍",
          "&atilde": "ã",
          "&atilde;": "ã",
          "&auml": "ä",
          "&auml;": "ä",
          "&awconint;": "∳",
          "&awint;": "⨑",
          "&bNot;": "⫭",
          "&backcong;": "≌",
          "&backepsilon;": "϶",
          "&backprime;": "‵",
          "&backsim;": "∽",
          "&backsimeq;": "⋍",
          "&barvee;": "⊽",
          "&barwed;": "⌅",
          "&barwedge;": "⌅",
          "&bbrk;": "⎵",
          "&bbrktbrk;": "⎶",
          "&bcong;": "≌",
          "&bcy;": "б",
          "&bdquo;": "„",
          "&becaus;": "∵",
          "&because;": "∵",
          "&bemptyv;": "⦰",
          "&bepsi;": "϶",
          "&bernou;": "ℬ",
          "&beta;": "β",
          "&beth;": "ℶ",
          "&between;": "≬",
          "&bfr;": "𝔟",
          "&bigcap;": "⋂",
          "&bigcirc;": "◯",
          "&bigcup;": "⋃",
          "&bigodot;": "⨀",
          "&bigoplus;": "⨁",
          "&bigotimes;": "⨂",
          "&bigsqcup;": "⨆",
          "&bigstar;": "★",
          "&bigtriangledown;": "▽",
          "&bigtriangleup;": "△",
          "&biguplus;": "⨄",
          "&bigvee;": "⋁",
          "&bigwedge;": "⋀",
          "&bkarow;": "⤍",
          "&blacklozenge;": "⧫",
          "&blacksquare;": "▪",
          "&blacktriangle;": "▴",
          "&blacktriangledown;": "▾",
          "&blacktriangleleft;": "◂",
          "&blacktriangleright;": "▸",
          "&blank;": "␣",
          "&blk12;": "▒",
          "&blk14;": "░",
          "&blk34;": "▓",
          "&block;": "█",
          "&bne;": "=⃥",
          "&bnequiv;": "≡⃥",
          "&bnot;": "⌐",
          "&bopf;": "𝕓",
          "&bot;": "⊥",
          "&bottom;": "⊥",
          "&bowtie;": "⋈",
          "&boxDL;": "╗",
          "&boxDR;": "╔",
          "&boxDl;": "╖",
          "&boxDr;": "╓",
          "&boxH;": "═",
          "&boxHD;": "╦",
          "&boxHU;": "╩",
          "&boxHd;": "╤",
          "&boxHu;": "╧",
          "&boxUL;": "╝",
          "&boxUR;": "╚",
          "&boxUl;": "╜",
          "&boxUr;": "╙",
          "&boxV;": "║",
          "&boxVH;": "╬",
          "&boxVL;": "╣",
          "&boxVR;": "╠",
          "&boxVh;": "╫",
          "&boxVl;": "╢",
          "&boxVr;": "╟",
          "&boxbox;": "⧉",
          "&boxdL;": "╕",
          "&boxdR;": "╒",
          "&boxdl;": "┐",
          "&boxdr;": "┌",
          "&boxh;": "─",
          "&boxhD;": "╥",
          "&boxhU;": "╨",
          "&boxhd;": "┬",
          "&boxhu;": "┴",
          "&boxminus;": "⊟",
          "&boxplus;": "⊞",
          "&boxtimes;": "⊠",
          "&boxuL;": "╛",
          "&boxuR;": "╘",
          "&boxul;": "┘",
          "&boxur;": "└",
          "&boxv;": "│",
          "&boxvH;": "╪",
          "&boxvL;": "╡",
          "&boxvR;": "╞",
          "&boxvh;": "┼",
          "&boxvl;": "┤",
          "&boxvr;": "├",
          "&bprime;": "‵",
          "&breve;": "˘",
          "&brvbar": "¦",
          "&brvbar;": "¦",
          "&bscr;": "𝒷",
          "&bsemi;": "⁏",
          "&bsim;": "∽",
          "&bsime;": "⋍",
          "&bsol;": "\\",
          "&bsolb;": "⧅",
          "&bsolhsub;": "⟈",
          "&bull;": "•",
          "&bullet;": "•",
          "&bump;": "≎",
          "&bumpE;": "⪮",
          "&bumpe;": "≏",
          "&bumpeq;": "≏",
          "&cacute;": "ć",
          "&cap;": "∩",
          "&capand;": "⩄",
          "&capbrcup;": "⩉",
          "&capcap;": "⩋",
          "&capcup;": "⩇",
          "&capdot;": "⩀",
          "&caps;": "∩︀",
          "&caret;": "⁁",
          "&caron;": "ˇ",
          "&ccaps;": "⩍",
          "&ccaron;": "č",
          "&ccedil": "ç",
          "&ccedil;": "ç",
          "&ccirc;": "ĉ",
          "&ccups;": "⩌",
          "&ccupssm;": "⩐",
          "&cdot;": "ċ",
          "&cedil": "¸",
          "&cedil;": "¸",
          "&cemptyv;": "⦲",
          "&cent": "¢",
          "&cent;": "¢",
          "&centerdot;": "·",
          "&cfr;": "𝔠",
          "&chcy;": "ч",
          "&check;": "✓",
          "&checkmark;": "✓",
          "&chi;": "χ",
          "&cir;": "○",
          "&cirE;": "⧃",
          "&circ;": "ˆ",
          "&circeq;": "≗",
          "&circlearrowleft;": "↺",
          "&circlearrowright;": "↻",
          "&circledR;": "®",
          "&circledS;": "Ⓢ",
          "&circledast;": "⊛",
          "&circledcirc;": "⊚",
          "&circleddash;": "⊝",
          "&cire;": "≗",
          "&cirfnint;": "⨐",
          "&cirmid;": "⫯",
          "&cirscir;": "⧂",
          "&clubs;": "♣",
          "&clubsuit;": "♣",
          "&colon;": ":",
          "&colone;": "≔",
          "&coloneq;": "≔",
          "&comma;": ",",
          "&commat;": "@",
          "&comp;": "∁",
          "&compfn;": "∘",
          "&complement;": "∁",
          "&complexes;": "ℂ",
          "&cong;": "≅",
          "&congdot;": "⩭",
          "&conint;": "∮",
          "&copf;": "𝕔",
          "&coprod;": "∐",
          "&copy": "©",
          "&copy;": "©",
          "&copysr;": "℗",
          "&crarr;": "↵",
          "&cross;": "✗",
          "&cscr;": "𝒸",
          "&csub;": "⫏",
          "&csube;": "⫑",
          "&csup;": "⫐",
          "&csupe;": "⫒",
          "&ctdot;": "⋯",
          "&cudarrl;": "⤸",
          "&cudarrr;": "⤵",
          "&cuepr;": "⋞",
          "&cuesc;": "⋟",
          "&cularr;": "↶",
          "&cularrp;": "⤽",
          "&cup;": "∪",
          "&cupbrcap;": "⩈",
          "&cupcap;": "⩆",
          "&cupcup;": "⩊",
          "&cupdot;": "⊍",
          "&cupor;": "⩅",
          "&cups;": "∪︀",
          "&curarr;": "↷",
          "&curarrm;": "⤼",
          "&curlyeqprec;": "⋞",
          "&curlyeqsucc;": "⋟",
          "&curlyvee;": "⋎",
          "&curlywedge;": "⋏",
          "&curren": "¤",
          "&curren;": "¤",
          "&curvearrowleft;": "↶",
          "&curvearrowright;": "↷",
          "&cuvee;": "⋎",
          "&cuwed;": "⋏",
          "&cwconint;": "∲",
          "&cwint;": "∱",
          "&cylcty;": "⌭",
          "&dArr;": "⇓",
          "&dHar;": "⥥",
          "&dagger;": "†",
          "&daleth;": "ℸ",
          "&darr;": "↓",
          "&dash;": "‐",
          "&dashv;": "⊣",
          "&dbkarow;": "⤏",
          "&dblac;": "˝",
          "&dcaron;": "ď",
          "&dcy;": "д",
          "&dd;": "ⅆ",
          "&ddagger;": "‡",
          "&ddarr;": "⇊",
          "&ddotseq;": "⩷",
          "&deg": "°",
          "&deg;": "°",
          "&delta;": "δ",
          "&demptyv;": "⦱",
          "&dfisht;": "⥿",
          "&dfr;": "𝔡",
          "&dharl;": "⇃",
          "&dharr;": "⇂",
          "&diam;": "⋄",
          "&diamond;": "⋄",
          "&diamondsuit;": "♦",
          "&diams;": "♦",
          "&die;": "¨",
          "&digamma;": "ϝ",
          "&disin;": "⋲",
          "&div;": "÷",
          "&divide": "÷",
          "&divide;": "÷",
          "&divideontimes;": "⋇",
          "&divonx;": "⋇",
          "&djcy;": "ђ",
          "&dlcorn;": "⌞",
          "&dlcrop;": "⌍",
          "&dollar;": "$",
          "&dopf;": "𝕕",
          "&dot;": "˙",
          "&doteq;": "≐",
          "&doteqdot;": "≑",
          "&dotminus;": "∸",
          "&dotplus;": "∔",
          "&dotsquare;": "⊡",
          "&doublebarwedge;": "⌆",
          "&downarrow;": "↓",
          "&downdownarrows;": "⇊",
          "&downharpoonleft;": "⇃",
          "&downharpoonright;": "⇂",
          "&drbkarow;": "⤐",
          "&drcorn;": "⌟",
          "&drcrop;": "⌌",
          "&dscr;": "𝒹",
          "&dscy;": "ѕ",
          "&dsol;": "⧶",
          "&dstrok;": "đ",
          "&dtdot;": "⋱",
          "&dtri;": "▿",
          "&dtrif;": "▾",
          "&duarr;": "⇵",
          "&duhar;": "⥯",
          "&dwangle;": "⦦",
          "&dzcy;": "џ",
          "&dzigrarr;": "⟿",
          "&eDDot;": "⩷",
          "&eDot;": "≑",
          "&eacute": "é",
          "&eacute;": "é",
          "&easter;": "⩮",
          "&ecaron;": "ě",
          "&ecir;": "≖",
          "&ecirc": "ê",
          "&ecirc;": "ê",
          "&ecolon;": "≕",
          "&ecy;": "э",
          "&edot;": "ė",
          "&ee;": "ⅇ",
          "&efDot;": "≒",
          "&efr;": "𝔢",
          "&eg;": "⪚",
          "&egrave": "è",
          "&egrave;": "è",
          "&egs;": "⪖",
          "&egsdot;": "⪘",
          "&el;": "⪙",
          "&elinters;": "⏧",
          "&ell;": "ℓ",
          "&els;": "⪕",
          "&elsdot;": "⪗",
          "&emacr;": "ē",
          "&empty;": "∅",
          "&emptyset;": "∅",
          "&emptyv;": "∅",
          "&emsp13;": " ",
          "&emsp14;": " ",
          "&emsp;": " ",
          "&eng;": "ŋ",
          "&ensp;": " ",
          "&eogon;": "ę",
          "&eopf;": "𝕖",
          "&epar;": "⋕",
          "&eparsl;": "⧣",
          "&eplus;": "⩱",
          "&epsi;": "ε",
          "&epsilon;": "ε",
          "&epsiv;": "ϵ",
          "&eqcirc;": "≖",
          "&eqcolon;": "≕",
          "&eqsim;": "≂",
          "&eqslantgtr;": "⪖",
          "&eqslantless;": "⪕",
          "&equals;": "=",
          "&equest;": "≟",
          "&equiv;": "≡",
          "&equivDD;": "⩸",
          "&eqvparsl;": "⧥",
          "&erDot;": "≓",
          "&erarr;": "⥱",
          "&escr;": "ℯ",
          "&esdot;": "≐",
          "&esim;": "≂",
          "&eta;": "η",
          "&eth": "ð",
          "&eth;": "ð",
          "&euml": "ë",
          "&euml;": "ë",
          "&euro;": "€",
          "&excl;": "!",
          "&exist;": "∃",
          "&expectation;": "ℰ",
          "&exponentiale;": "ⅇ",
          "&fallingdotseq;": "≒",
          "&fcy;": "ф",
          "&female;": "♀",
          "&ffilig;": "ﬃ",
          "&fflig;": "ﬀ",
          "&ffllig;": "ﬄ",
          "&ffr;": "𝔣",
          "&filig;": "ﬁ",
          "&fjlig;": "fj",
          "&flat;": "♭",
          "&fllig;": "ﬂ",
          "&fltns;": "▱",
          "&fnof;": "ƒ",
          "&fopf;": "𝕗",
          "&forall;": "∀",
          "&fork;": "⋔",
          "&forkv;": "⫙",
          "&fpartint;": "⨍",
          "&frac12": "½",
          "&frac12;": "½",
          "&frac13;": "⅓",
          "&frac14": "¼",
          "&frac14;": "¼",
          "&frac15;": "⅕",
          "&frac16;": "⅙",
          "&frac18;": "⅛",
          "&frac23;": "⅔",
          "&frac25;": "⅖",
          "&frac34": "¾",
          "&frac34;": "¾",
          "&frac35;": "⅗",
          "&frac38;": "⅜",
          "&frac45;": "⅘",
          "&frac56;": "⅚",
          "&frac58;": "⅝",
          "&frac78;": "⅞",
          "&frasl;": "⁄",
          "&frown;": "⌢",
          "&fscr;": "𝒻",
          "&gE;": "≧",
          "&gEl;": "⪌",
          "&gacute;": "ǵ",
          "&gamma;": "γ",
          "&gammad;": "ϝ",
          "&gap;": "⪆",
          "&gbreve;": "ğ",
          "&gcirc;": "ĝ",
          "&gcy;": "г",
          "&gdot;": "ġ",
          "&ge;": "≥",
          "&gel;": "⋛",
          "&geq;": "≥",
          "&geqq;": "≧",
          "&geqslant;": "⩾",
          "&ges;": "⩾",
          "&gescc;": "⪩",
          "&gesdot;": "⪀",
          "&gesdoto;": "⪂",
          "&gesdotol;": "⪄",
          "&gesl;": "⋛︀",
          "&gesles;": "⪔",
          "&gfr;": "𝔤",
          "&gg;": "≫",
          "&ggg;": "⋙",
          "&gimel;": "ℷ",
          "&gjcy;": "ѓ",
          "&gl;": "≷",
          "&glE;": "⪒",
          "&gla;": "⪥",
          "&glj;": "⪤",
          "&gnE;": "≩",
          "&gnap;": "⪊",
          "&gnapprox;": "⪊",
          "&gne;": "⪈",
          "&gneq;": "⪈",
          "&gneqq;": "≩",
          "&gnsim;": "⋧",
          "&gopf;": "𝕘",
          "&grave;": "`",
          "&gscr;": "ℊ",
          "&gsim;": "≳",
          "&gsime;": "⪎",
          "&gsiml;": "⪐",
          "&gt": ">",
          "&gt;": ">",
          "&gtcc;": "⪧",
          "&gtcir;": "⩺",
          "&gtdot;": "⋗",
          "&gtlPar;": "⦕",
          "&gtquest;": "⩼",
          "&gtrapprox;": "⪆",
          "&gtrarr;": "⥸",
          "&gtrdot;": "⋗",
          "&gtreqless;": "⋛",
          "&gtreqqless;": "⪌",
          "&gtrless;": "≷",
          "&gtrsim;": "≳",
          "&gvertneqq;": "≩︀",
          "&gvnE;": "≩︀",
          "&hArr;": "⇔",
          "&hairsp;": " ",
          "&half;": "½",
          "&hamilt;": "ℋ",
          "&hardcy;": "ъ",
          "&harr;": "↔",
          "&harrcir;": "⥈",
          "&harrw;": "↭",
          "&hbar;": "ℏ",
          "&hcirc;": "ĥ",
          "&hearts;": "♥",
          "&heartsuit;": "♥",
          "&hellip;": "…",
          "&hercon;": "⊹",
          "&hfr;": "𝔥",
          "&hksearow;": "⤥",
          "&hkswarow;": "⤦",
          "&hoarr;": "⇿",
          "&homtht;": "∻",
          "&hookleftarrow;": "↩",
          "&hookrightarrow;": "↪",
          "&hopf;": "𝕙",
          "&horbar;": "―",
          "&hscr;": "𝒽",
          "&hslash;": "ℏ",
          "&hstrok;": "ħ",
          "&hybull;": "⁃",
          "&hyphen;": "‐",
          "&iacute": "í",
          "&iacute;": "í",
          "&ic;": "⁣",
          "&icirc": "î",
          "&icirc;": "î",
          "&icy;": "и",
          "&iecy;": "е",
          "&iexcl": "¡",
          "&iexcl;": "¡",
          "&iff;": "⇔",
          "&ifr;": "𝔦",
          "&igrave": "ì",
          "&igrave;": "ì",
          "&ii;": "ⅈ",
          "&iiiint;": "⨌",
          "&iiint;": "∭",
          "&iinfin;": "⧜",
          "&iiota;": "℩",
          "&ijlig;": "ĳ",
          "&imacr;": "ī",
          "&image;": "ℑ",
          "&imagline;": "ℐ",
          "&imagpart;": "ℑ",
          "&imath;": "ı",
          "&imof;": "⊷",
          "&imped;": "Ƶ",
          "&in;": "∈",
          "&incare;": "℅",
          "&infin;": "∞",
          "&infintie;": "⧝",
          "&inodot;": "ı",
          "&int;": "∫",
          "&intcal;": "⊺",
          "&integers;": "ℤ",
          "&intercal;": "⊺",
          "&intlarhk;": "⨗",
          "&intprod;": "⨼",
          "&iocy;": "ё",
          "&iogon;": "į",
          "&iopf;": "𝕚",
          "&iota;": "ι",
          "&iprod;": "⨼",
          "&iquest": "¿",
          "&iquest;": "¿",
          "&iscr;": "𝒾",
          "&isin;": "∈",
          "&isinE;": "⋹",
          "&isindot;": "⋵",
          "&isins;": "⋴",
          "&isinsv;": "⋳",
          "&isinv;": "∈",
          "&it;": "⁢",
          "&itilde;": "ĩ",
          "&iukcy;": "і",
          "&iuml": "ï",
          "&iuml;": "ï",
          "&jcirc;": "ĵ",
          "&jcy;": "й",
          "&jfr;": "𝔧",
          "&jmath;": "ȷ",
          "&jopf;": "𝕛",
          "&jscr;": "𝒿",
          "&jsercy;": "ј",
          "&jukcy;": "є",
          "&kappa;": "κ",
          "&kappav;": "ϰ",
          "&kcedil;": "ķ",
          "&kcy;": "к",
          "&kfr;": "𝔨",
          "&kgreen;": "ĸ",
          "&khcy;": "х",
          "&kjcy;": "ќ",
          "&kopf;": "𝕜",
          "&kscr;": "𝓀",
          "&lAarr;": "⇚",
          "&lArr;": "⇐",
          "&lAtail;": "⤛",
          "&lBarr;": "⤎",
          "&lE;": "≦",
          "&lEg;": "⪋",
          "&lHar;": "⥢",
          "&lacute;": "ĺ",
          "&laemptyv;": "⦴",
          "&lagran;": "ℒ",
          "&lambda;": "λ",
          "&lang;": "⟨",
          "&langd;": "⦑",
          "&langle;": "⟨",
          "&lap;": "⪅",
          "&laquo": "«",
          "&laquo;": "«",
          "&larr;": "←",
          "&larrb;": "⇤",
          "&larrbfs;": "⤟",
          "&larrfs;": "⤝",
          "&larrhk;": "↩",
          "&larrlp;": "↫",
          "&larrpl;": "⤹",
          "&larrsim;": "⥳",
          "&larrtl;": "↢",
          "&lat;": "⪫",
          "&latail;": "⤙",
          "&late;": "⪭",
          "&lates;": "⪭︀",
          "&lbarr;": "⤌",
          "&lbbrk;": "❲",
          "&lbrace;": "{",
          "&lbrack;": "[",
          "&lbrke;": "⦋",
          "&lbrksld;": "⦏",
          "&lbrkslu;": "⦍",
          "&lcaron;": "ľ",
          "&lcedil;": "ļ",
          "&lceil;": "⌈",
          "&lcub;": "{",
          "&lcy;": "л",
          "&ldca;": "⤶",
          "&ldquo;": "“",
          "&ldquor;": "„",
          "&ldrdhar;": "⥧",
          "&ldrushar;": "⥋",
          "&ldsh;": "↲",
          "&le;": "≤",
          "&leftarrow;": "←",
          "&leftarrowtail;": "↢",
          "&leftharpoondown;": "↽",
          "&leftharpoonup;": "↼",
          "&leftleftarrows;": "⇇",
          "&leftrightarrow;": "↔",
          "&leftrightarrows;": "⇆",
          "&leftrightharpoons;": "⇋",
          "&leftrightsquigarrow;": "↭",
          "&leftthreetimes;": "⋋",
          "&leg;": "⋚",
          "&leq;": "≤",
          "&leqq;": "≦",
          "&leqslant;": "⩽",
          "&les;": "⩽",
          "&lescc;": "⪨",
          "&lesdot;": "⩿",
          "&lesdoto;": "⪁",
          "&lesdotor;": "⪃",
          "&lesg;": "⋚︀",
          "&lesges;": "⪓",
          "&lessapprox;": "⪅",
          "&lessdot;": "⋖",
          "&lesseqgtr;": "⋚",
          "&lesseqqgtr;": "⪋",
          "&lessgtr;": "≶",
          "&lesssim;": "≲",
          "&lfisht;": "⥼",
          "&lfloor;": "⌊",
          "&lfr;": "𝔩",
          "&lg;": "≶",
          "&lgE;": "⪑",
          "&lhard;": "↽",
          "&lharu;": "↼",
          "&lharul;": "⥪",
          "&lhblk;": "▄",
          "&ljcy;": "љ",
          "&ll;": "≪",
          "&llarr;": "⇇",
          "&llcorner;": "⌞",
          "&llhard;": "⥫",
          "&lltri;": "◺",
          "&lmidot;": "ŀ",
          "&lmoust;": "⎰",
          "&lmoustache;": "⎰",
          "&lnE;": "≨",
          "&lnap;": "⪉",
          "&lnapprox;": "⪉",
          "&lne;": "⪇",
          "&lneq;": "⪇",
          "&lneqq;": "≨",
          "&lnsim;": "⋦",
          "&loang;": "⟬",
          "&loarr;": "⇽",
          "&lobrk;": "⟦",
          "&longleftarrow;": "⟵",
          "&longleftrightarrow;": "⟷",
          "&longmapsto;": "⟼",
          "&longrightarrow;": "⟶",
          "&looparrowleft;": "↫",
          "&looparrowright;": "↬",
          "&lopar;": "⦅",
          "&lopf;": "𝕝",
          "&loplus;": "⨭",
          "&lotimes;": "⨴",
          "&lowast;": "∗",
          "&lowbar;": "_",
          "&loz;": "◊",
          "&lozenge;": "◊",
          "&lozf;": "⧫",
          "&lpar;": "(",
          "&lparlt;": "⦓",
          "&lrarr;": "⇆",
          "&lrcorner;": "⌟",
          "&lrhar;": "⇋",
          "&lrhard;": "⥭",
          "&lrm;": "‎",
          "&lrtri;": "⊿",
          "&lsaquo;": "‹",
          "&lscr;": "𝓁",
          "&lsh;": "↰",
          "&lsim;": "≲",
          "&lsime;": "⪍",
          "&lsimg;": "⪏",
          "&lsqb;": "[",
          "&lsquo;": "‘",
          "&lsquor;": "‚",
          "&lstrok;": "ł",
          "&lt": "<",
          "&lt;": "<",
          "&ltcc;": "⪦",
          "&ltcir;": "⩹",
          "&ltdot;": "⋖",
          "&lthree;": "⋋",
          "&ltimes;": "⋉",
          "&ltlarr;": "⥶",
          "&ltquest;": "⩻",
          "&ltrPar;": "⦖",
          "&ltri;": "◃",
          "&ltrie;": "⊴",
          "&ltrif;": "◂",
          "&lurdshar;": "⥊",
          "&luruhar;": "⥦",
          "&lvertneqq;": "≨︀",
          "&lvnE;": "≨︀",
          "&mDDot;": "∺",
          "&macr": "¯",
          "&macr;": "¯",
          "&male;": "♂",
          "&malt;": "✠",
          "&maltese;": "✠",
          "&map;": "↦",
          "&mapsto;": "↦",
          "&mapstodown;": "↧",
          "&mapstoleft;": "↤",
          "&mapstoup;": "↥",
          "&marker;": "▮",
          "&mcomma;": "⨩",
          "&mcy;": "м",
          "&mdash;": "—",
          "&measuredangle;": "∡",
          "&mfr;": "𝔪",
          "&mho;": "℧",
          "&micro": "µ",
          "&micro;": "µ",
          "&mid;": "∣",
          "&midast;": "*",
          "&midcir;": "⫰",
          "&middot": "·",
          "&middot;": "·",
          "&minus;": "−",
          "&minusb;": "⊟",
          "&minusd;": "∸",
          "&minusdu;": "⨪",
          "&mlcp;": "⫛",
          "&mldr;": "…",
          "&mnplus;": "∓",
          "&models;": "⊧",
          "&mopf;": "𝕞",
          "&mp;": "∓",
          "&mscr;": "𝓂",
          "&mstpos;": "∾",
          "&mu;": "μ",
          "&multimap;": "⊸",
          "&mumap;": "⊸",
          "&nGg;": "⋙̸",
          "&nGt;": "≫⃒",
          "&nGtv;": "≫̸",
          "&nLeftarrow;": "⇍",
          "&nLeftrightarrow;": "⇎",
          "&nLl;": "⋘̸",
          "&nLt;": "≪⃒",
          "&nLtv;": "≪̸",
          "&nRightarrow;": "⇏",
          "&nVDash;": "⊯",
          "&nVdash;": "⊮",
          "&nabla;": "∇",
          "&nacute;": "ń",
          "&nang;": "∠⃒",
          "&nap;": "≉",
          "&napE;": "⩰̸",
          "&napid;": "≋̸",
          "&napos;": "ŉ",
          "&napprox;": "≉",
          "&natur;": "♮",
          "&natural;": "♮",
          "&naturals;": "ℕ",
          "&nbsp": " ",
          "&nbsp;": " ",
          "&nbump;": "≎̸",
          "&nbumpe;": "≏̸",
          "&ncap;": "⩃",
          "&ncaron;": "ň",
          "&ncedil;": "ņ",
          "&ncong;": "≇",
          "&ncongdot;": "⩭̸",
          "&ncup;": "⩂",
          "&ncy;": "н",
          "&ndash;": "–",
          "&ne;": "≠",
          "&neArr;": "⇗",
          "&nearhk;": "⤤",
          "&nearr;": "↗",
          "&nearrow;": "↗",
          "&nedot;": "≐̸",
          "&nequiv;": "≢",
          "&nesear;": "⤨",
          "&nesim;": "≂̸",
          "&nexist;": "∄",
          "&nexists;": "∄",
          "&nfr;": "𝔫",
          "&ngE;": "≧̸",
          "&nge;": "≱",
          "&ngeq;": "≱",
          "&ngeqq;": "≧̸",
          "&ngeqslant;": "⩾̸",
          "&nges;": "⩾̸",
          "&ngsim;": "≵",
          "&ngt;": "≯",
          "&ngtr;": "≯",
          "&nhArr;": "⇎",
          "&nharr;": "↮",
          "&nhpar;": "⫲",
          "&ni;": "∋",
          "&nis;": "⋼",
          "&nisd;": "⋺",
          "&niv;": "∋",
          "&njcy;": "њ",
          "&nlArr;": "⇍",
          "&nlE;": "≦̸",
          "&nlarr;": "↚",
          "&nldr;": "‥",
          "&nle;": "≰",
          "&nleftarrow;": "↚",
          "&nleftrightarrow;": "↮",
          "&nleq;": "≰",
          "&nleqq;": "≦̸",
          "&nleqslant;": "⩽̸",
          "&nles;": "⩽̸",
          "&nless;": "≮",
          "&nlsim;": "≴",
          "&nlt;": "≮",
          "&nltri;": "⋪",
          "&nltrie;": "⋬",
          "&nmid;": "∤",
          "&nopf;": "𝕟",
          "&not": "¬",
          "&not;": "¬",
          "&notin;": "∉",
          "&notinE;": "⋹̸",
          "&notindot;": "⋵̸",
          "&notinva;": "∉",
          "&notinvb;": "⋷",
          "&notinvc;": "⋶",
          "&notni;": "∌",
          "&notniva;": "∌",
          "&notnivb;": "⋾",
          "&notnivc;": "⋽",
          "&npar;": "∦",
          "&nparallel;": "∦",
          "&nparsl;": "⫽⃥",
          "&npart;": "∂̸",
          "&npolint;": "⨔",
          "&npr;": "⊀",
          "&nprcue;": "⋠",
          "&npre;": "⪯̸",
          "&nprec;": "⊀",
          "&npreceq;": "⪯̸",
          "&nrArr;": "⇏",
          "&nrarr;": "↛",
          "&nrarrc;": "⤳̸",
          "&nrarrw;": "↝̸",
          "&nrightarrow;": "↛",
          "&nrtri;": "⋫",
          "&nrtrie;": "⋭",
          "&nsc;": "⊁",
          "&nsccue;": "⋡",
          "&nsce;": "⪰̸",
          "&nscr;": "𝓃",
          "&nshortmid;": "∤",
          "&nshortparallel;": "∦",
          "&nsim;": "≁",
          "&nsime;": "≄",
          "&nsimeq;": "≄",
          "&nsmid;": "∤",
          "&nspar;": "∦",
          "&nsqsube;": "⋢",
          "&nsqsupe;": "⋣",
          "&nsub;": "⊄",
          "&nsubE;": "⫅̸",
          "&nsube;": "⊈",
          "&nsubset;": "⊂⃒",
          "&nsubseteq;": "⊈",
          "&nsubseteqq;": "⫅̸",
          "&nsucc;": "⊁",
          "&nsucceq;": "⪰̸",
          "&nsup;": "⊅",
          "&nsupE;": "⫆̸",
          "&nsupe;": "⊉",
          "&nsupset;": "⊃⃒",
          "&nsupseteq;": "⊉",
          "&nsupseteqq;": "⫆̸",
          "&ntgl;": "≹",
          "&ntilde": "ñ",
          "&ntilde;": "ñ",
          "&ntlg;": "≸",
          "&ntriangleleft;": "⋪",
          "&ntrianglelefteq;": "⋬",
          "&ntriangleright;": "⋫",
          "&ntrianglerighteq;": "⋭",
          "&nu;": "ν",
          "&num;": "#",
          "&numero;": "№",
          "&numsp;": " ",
          "&nvDash;": "⊭",
          "&nvHarr;": "⤄",
          "&nvap;": "≍⃒",
          "&nvdash;": "⊬",
          "&nvge;": "≥⃒",
          "&nvgt;": ">⃒",
          "&nvinfin;": "⧞",
          "&nvlArr;": "⤂",
          "&nvle;": "≤⃒",
          "&nvlt;": "<⃒",
          "&nvltrie;": "⊴⃒",
          "&nvrArr;": "⤃",
          "&nvrtrie;": "⊵⃒",
          "&nvsim;": "∼⃒",
          "&nwArr;": "⇖",
          "&nwarhk;": "⤣",
          "&nwarr;": "↖",
          "&nwarrow;": "↖",
          "&nwnear;": "⤧",
          "&oS;": "Ⓢ",
          "&oacute": "ó",
          "&oacute;": "ó",
          "&oast;": "⊛",
          "&ocir;": "⊚",
          "&ocirc": "ô",
          "&ocirc;": "ô",
          "&ocy;": "о",
          "&odash;": "⊝",
          "&odblac;": "ő",
          "&odiv;": "⨸",
          "&odot;": "⊙",
          "&odsold;": "⦼",
          "&oelig;": "œ",
          "&ofcir;": "⦿",
          "&ofr;": "𝔬",
          "&ogon;": "˛",
          "&ograve": "ò",
          "&ograve;": "ò",
          "&ogt;": "⧁",
          "&ohbar;": "⦵",
          "&ohm;": "Ω",
          "&oint;": "∮",
          "&olarr;": "↺",
          "&olcir;": "⦾",
          "&olcross;": "⦻",
          "&oline;": "‾",
          "&olt;": "⧀",
          "&omacr;": "ō",
          "&omega;": "ω",
          "&omicron;": "ο",
          "&omid;": "⦶",
          "&ominus;": "⊖",
          "&oopf;": "𝕠",
          "&opar;": "⦷",
          "&operp;": "⦹",
          "&oplus;": "⊕",
          "&or;": "∨",
          "&orarr;": "↻",
          "&ord;": "⩝",
          "&order;": "ℴ",
          "&orderof;": "ℴ",
          "&ordf": "ª",
          "&ordf;": "ª",
          "&ordm": "º",
          "&ordm;": "º",
          "&origof;": "⊶",
          "&oror;": "⩖",
          "&orslope;": "⩗",
          "&orv;": "⩛",
          "&oscr;": "ℴ",
          "&oslash": "ø",
          "&oslash;": "ø",
          "&osol;": "⊘",
          "&otilde": "õ",
          "&otilde;": "õ",
          "&otimes;": "⊗",
          "&otimesas;": "⨶",
          "&ouml": "ö",
          "&ouml;": "ö",
          "&ovbar;": "⌽",
          "&par;": "∥",
          "&para": "¶",
          "&para;": "¶",
          "&parallel;": "∥",
          "&parsim;": "⫳",
          "&parsl;": "⫽",
          "&part;": "∂",
          "&pcy;": "п",
          "&percnt;": "%",
          "&period;": ".",
          "&permil;": "‰",
          "&perp;": "⊥",
          "&pertenk;": "‱",
          "&pfr;": "𝔭",
          "&phi;": "φ",
          "&phiv;": "ϕ",
          "&phmmat;": "ℳ",
          "&phone;": "☎",
          "&pi;": "π",
          "&pitchfork;": "⋔",
          "&piv;": "ϖ",
          "&planck;": "ℏ",
          "&planckh;": "ℎ",
          "&plankv;": "ℏ",
          "&plus;": "+",
          "&plusacir;": "⨣",
          "&plusb;": "⊞",
          "&pluscir;": "⨢",
          "&plusdo;": "∔",
          "&plusdu;": "⨥",
          "&pluse;": "⩲",
          "&plusmn": "±",
          "&plusmn;": "±",
          "&plussim;": "⨦",
          "&plustwo;": "⨧",
          "&pm;": "±",
          "&pointint;": "⨕",
          "&popf;": "𝕡",
          "&pound": "£",
          "&pound;": "£",
          "&pr;": "≺",
          "&prE;": "⪳",
          "&prap;": "⪷",
          "&prcue;": "≼",
          "&pre;": "⪯",
          "&prec;": "≺",
          "&precapprox;": "⪷",
          "&preccurlyeq;": "≼",
          "&preceq;": "⪯",
          "&precnapprox;": "⪹",
          "&precneqq;": "⪵",
          "&precnsim;": "⋨",
          "&precsim;": "≾",
          "&prime;": "′",
          "&primes;": "ℙ",
          "&prnE;": "⪵",
          "&prnap;": "⪹",
          "&prnsim;": "⋨",
          "&prod;": "∏",
          "&profalar;": "⌮",
          "&profline;": "⌒",
          "&profsurf;": "⌓",
          "&prop;": "∝",
          "&propto;": "∝",
          "&prsim;": "≾",
          "&prurel;": "⊰",
          "&pscr;": "𝓅",
          "&psi;": "ψ",
          "&puncsp;": " ",
          "&qfr;": "𝔮",
          "&qint;": "⨌",
          "&qopf;": "𝕢",
          "&qprime;": "⁗",
          "&qscr;": "𝓆",
          "&quaternions;": "ℍ",
          "&quatint;": "⨖",
          "&quest;": "?",
          "&questeq;": "≟",
          "&quot": "\"",
          "&quot;": "\"",
          "&rAarr;": "⇛",
          "&rArr;": "⇒",
          "&rAtail;": "⤜",
          "&rBarr;": "⤏",
          "&rHar;": "⥤",
          "&race;": "∽̱",
          "&racute;": "ŕ",
          "&radic;": "√",
          "&raemptyv;": "⦳",
          "&rang;": "⟩",
          "&rangd;": "⦒",
          "&range;": "⦥",
          "&rangle;": "⟩",
          "&raquo": "»",
          "&raquo;": "»",
          "&rarr;": "→",
          "&rarrap;": "⥵",
          "&rarrb;": "⇥",
          "&rarrbfs;": "⤠",
          "&rarrc;": "⤳",
          "&rarrfs;": "⤞",
          "&rarrhk;": "↪",
          "&rarrlp;": "↬",
          "&rarrpl;": "⥅",
          "&rarrsim;": "⥴",
          "&rarrtl;": "↣",
          "&rarrw;": "↝",
          "&ratail;": "⤚",
          "&ratio;": "∶",
          "&rationals;": "ℚ",
          "&rbarr;": "⤍",
          "&rbbrk;": "❳",
          "&rbrace;": "}",
          "&rbrack;": "]",
          "&rbrke;": "⦌",
          "&rbrksld;": "⦎",
          "&rbrkslu;": "⦐",
          "&rcaron;": "ř",
          "&rcedil;": "ŗ",
          "&rceil;": "⌉",
          "&rcub;": "}",
          "&rcy;": "р",
          "&rdca;": "⤷",
          "&rdldhar;": "⥩",
          "&rdquo;": "”",
          "&rdquor;": "”",
          "&rdsh;": "↳",
          "&real;": "ℜ",
          "&realine;": "ℛ",
          "&realpart;": "ℜ",
          "&reals;": "ℝ",
          "&rect;": "▭",
          "&reg": "®",
          "&reg;": "®",
          "&rfisht;": "⥽",
          "&rfloor;": "⌋",
          "&rfr;": "𝔯",
          "&rhard;": "⇁",
          "&rharu;": "⇀",
          "&rharul;": "⥬",
          "&rho;": "ρ",
          "&rhov;": "ϱ",
          "&rightarrow;": "→",
          "&rightarrowtail;": "↣",
          "&rightharpoondown;": "⇁",
          "&rightharpoonup;": "⇀",
          "&rightleftarrows;": "⇄",
          "&rightleftharpoons;": "⇌",
          "&rightrightarrows;": "⇉",
          "&rightsquigarrow;": "↝",
          "&rightthreetimes;": "⋌",
          "&ring;": "˚",
          "&risingdotseq;": "≓",
          "&rlarr;": "⇄",
          "&rlhar;": "⇌",
          "&rlm;": "‏",
          "&rmoust;": "⎱",
          "&rmoustache;": "⎱",
          "&rnmid;": "⫮",
          "&roang;": "⟭",
          "&roarr;": "⇾",
          "&robrk;": "⟧",
          "&ropar;": "⦆",
          "&ropf;": "𝕣",
          "&roplus;": "⨮",
          "&rotimes;": "⨵",
          "&rpar;": ")",
          "&rpargt;": "⦔",
          "&rppolint;": "⨒",
          "&rrarr;": "⇉",
          "&rsaquo;": "›",
          "&rscr;": "𝓇",
          "&rsh;": "↱",
          "&rsqb;": "]",
          "&rsquo;": "’",
          "&rsquor;": "’",
          "&rthree;": "⋌",
          "&rtimes;": "⋊",
          "&rtri;": "▹",
          "&rtrie;": "⊵",
          "&rtrif;": "▸",
          "&rtriltri;": "⧎",
          "&ruluhar;": "⥨",
          "&rx;": "℞",
          "&sacute;": "ś",
          "&sbquo;": "‚",
          "&sc;": "≻",
          "&scE;": "⪴",
          "&scap;": "⪸",
          "&scaron;": "š",
          "&sccue;": "≽",
          "&sce;": "⪰",
          "&scedil;": "ş",
          "&scirc;": "ŝ",
          "&scnE;": "⪶",
          "&scnap;": "⪺",
          "&scnsim;": "⋩",
          "&scpolint;": "⨓",
          "&scsim;": "≿",
          "&scy;": "с",
          "&sdot;": "⋅",
          "&sdotb;": "⊡",
          "&sdote;": "⩦",
          "&seArr;": "⇘",
          "&searhk;": "⤥",
          "&searr;": "↘",
          "&searrow;": "↘",
          "&sect": "§",
          "&sect;": "§",
          "&semi;": ";",
          "&seswar;": "⤩",
          "&setminus;": "∖",
          "&setmn;": "∖",
          "&sext;": "✶",
          "&sfr;": "𝔰",
          "&sfrown;": "⌢",
          "&sharp;": "♯",
          "&shchcy;": "щ",
          "&shcy;": "ш",
          "&shortmid;": "∣",
          "&shortparallel;": "∥",
          "&shy": "­",
          "&shy;": "­",
          "&sigma;": "σ",
          "&sigmaf;": "ς",
          "&sigmav;": "ς",
          "&sim;": "∼",
          "&simdot;": "⩪",
          "&sime;": "≃",
          "&simeq;": "≃",
          "&simg;": "⪞",
          "&simgE;": "⪠",
          "&siml;": "⪝",
          "&simlE;": "⪟",
          "&simne;": "≆",
          "&simplus;": "⨤",
          "&simrarr;": "⥲",
          "&slarr;": "←",
          "&smallsetminus;": "∖",
          "&smashp;": "⨳",
          "&smeparsl;": "⧤",
          "&smid;": "∣",
          "&smile;": "⌣",
          "&smt;": "⪪",
          "&smte;": "⪬",
          "&smtes;": "⪬︀",
          "&softcy;": "ь",
          "&sol;": "/",
          "&solb;": "⧄",
          "&solbar;": "⌿",
          "&sopf;": "𝕤",
          "&spades;": "♠",
          "&spadesuit;": "♠",
          "&spar;": "∥",
          "&sqcap;": "⊓",
          "&sqcaps;": "⊓︀",
          "&sqcup;": "⊔",
          "&sqcups;": "⊔︀",
          "&sqsub;": "⊏",
          "&sqsube;": "⊑",
          "&sqsubset;": "⊏",
          "&sqsubseteq;": "⊑",
          "&sqsup;": "⊐",
          "&sqsupe;": "⊒",
          "&sqsupset;": "⊐",
          "&sqsupseteq;": "⊒",
          "&squ;": "□",
          "&square;": "□",
          "&squarf;": "▪",
          "&squf;": "▪",
          "&srarr;": "→",
          "&sscr;": "𝓈",
          "&ssetmn;": "∖",
          "&ssmile;": "⌣",
          "&sstarf;": "⋆",
          "&star;": "☆",
          "&starf;": "★",
          "&straightepsilon;": "ϵ",
          "&straightphi;": "ϕ",
          "&strns;": "¯",
          "&sub;": "⊂",
          "&subE;": "⫅",
          "&subdot;": "⪽",
          "&sube;": "⊆",
          "&subedot;": "⫃",
          "&submult;": "⫁",
          "&subnE;": "⫋",
          "&subne;": "⊊",
          "&subplus;": "⪿",
          "&subrarr;": "⥹",
          "&subset;": "⊂",
          "&subseteq;": "⊆",
          "&subseteqq;": "⫅",
          "&subsetneq;": "⊊",
          "&subsetneqq;": "⫋",
          "&subsim;": "⫇",
          "&subsub;": "⫕",
          "&subsup;": "⫓",
          "&succ;": "≻",
          "&succapprox;": "⪸",
          "&succcurlyeq;": "≽",
          "&succeq;": "⪰",
          "&succnapprox;": "⪺",
          "&succneqq;": "⪶",
          "&succnsim;": "⋩",
          "&succsim;": "≿",
          "&sum;": "∑",
          "&sung;": "♪",
          "&sup1": "¹",
          "&sup1;": "¹",
          "&sup2": "²",
          "&sup2;": "²",
          "&sup3": "³",
          "&sup3;": "³",
          "&sup;": "⊃",
          "&supE;": "⫆",
          "&supdot;": "⪾",
          "&supdsub;": "⫘",
          "&supe;": "⊇",
          "&supedot;": "⫄",
          "&suphsol;": "⟉",
          "&suphsub;": "⫗",
          "&suplarr;": "⥻",
          "&supmult;": "⫂",
          "&supnE;": "⫌",
          "&supne;": "⊋",
          "&supplus;": "⫀",
          "&supset;": "⊃",
          "&supseteq;": "⊇",
          "&supseteqq;": "⫆",
          "&supsetneq;": "⊋",
          "&supsetneqq;": "⫌",
          "&supsim;": "⫈",
          "&supsub;": "⫔",
          "&supsup;": "⫖",
          "&swArr;": "⇙",
          "&swarhk;": "⤦",
          "&swarr;": "↙",
          "&swarrow;": "↙",
          "&swnwar;": "⤪",
          "&szlig": "ß",
          "&szlig;": "ß",
          "&target;": "⌖",
          "&tau;": "τ",
          "&tbrk;": "⎴",
          "&tcaron;": "ť",
          "&tcedil;": "ţ",
          "&tcy;": "т",
          "&tdot;": "⃛",
          "&telrec;": "⌕",
          "&tfr;": "𝔱",
          "&there4;": "∴",
          "&therefore;": "∴",
          "&theta;": "θ",
          "&thetasym;": "ϑ",
          "&thetav;": "ϑ",
          "&thickapprox;": "≈",
          "&thicksim;": "∼",
          "&thinsp;": " ",
          "&thkap;": "≈",
          "&thksim;": "∼",
          "&thorn": "þ",
          "&thorn;": "þ",
          "&tilde;": "˜",
          "&times": "×",
          "&times;": "×",
          "&timesb;": "⊠",
          "&timesbar;": "⨱",
          "&timesd;": "⨰",
          "&tint;": "∭",
          "&toea;": "⤨",
          "&top;": "⊤",
          "&topbot;": "⌶",
          "&topcir;": "⫱",
          "&topf;": "𝕥",
          "&topfork;": "⫚",
          "&tosa;": "⤩",
          "&tprime;": "‴",
          "&trade;": "™",
          "&triangle;": "▵",
          "&triangledown;": "▿",
          "&triangleleft;": "◃",
          "&trianglelefteq;": "⊴",
          "&triangleq;": "≜",
          "&triangleright;": "▹",
          "&trianglerighteq;": "⊵",
          "&tridot;": "◬",
          "&trie;": "≜",
          "&triminus;": "⨺",
          "&triplus;": "⨹",
          "&trisb;": "⧍",
          "&tritime;": "⨻",
          "&trpezium;": "⏢",
          "&tscr;": "𝓉",
          "&tscy;": "ц",
          "&tshcy;": "ћ",
          "&tstrok;": "ŧ",
          "&twixt;": "≬",
          "&twoheadleftarrow;": "↞",
          "&twoheadrightarrow;": "↠",
          "&uArr;": "⇑",
          "&uHar;": "⥣",
          "&uacute": "ú",
          "&uacute;": "ú",
          "&uarr;": "↑",
          "&ubrcy;": "ў",
          "&ubreve;": "ŭ",
          "&ucirc": "û",
          "&ucirc;": "û",
          "&ucy;": "у",
          "&udarr;": "⇅",
          "&udblac;": "ű",
          "&udhar;": "⥮",
          "&ufisht;": "⥾",
          "&ufr;": "𝔲",
          "&ugrave": "ù",
          "&ugrave;": "ù",
          "&uharl;": "↿",
          "&uharr;": "↾",
          "&uhblk;": "▀",
          "&ulcorn;": "⌜",
          "&ulcorner;": "⌜",
          "&ulcrop;": "⌏",
          "&ultri;": "◸",
          "&umacr;": "ū",
          "&uml": "¨",
          "&uml;": "¨",
          "&uogon;": "ų",
          "&uopf;": "𝕦",
          "&uparrow;": "↑",
          "&updownarrow;": "↕",
          "&upharpoonleft;": "↿",
          "&upharpoonright;": "↾",
          "&uplus;": "⊎",
          "&upsi;": "υ",
          "&upsih;": "ϒ",
          "&upsilon;": "υ",
          "&upuparrows;": "⇈",
          "&urcorn;": "⌝",
          "&urcorner;": "⌝",
          "&urcrop;": "⌎",
          "&uring;": "ů",
          "&urtri;": "◹",
          "&uscr;": "𝓊",
          "&utdot;": "⋰",
          "&utilde;": "ũ",
          "&utri;": "▵",
          "&utrif;": "▴",
          "&uuarr;": "⇈",
          "&uuml": "ü",
          "&uuml;": "ü",
          "&uwangle;": "⦧",
          "&vArr;": "⇕",
          "&vBar;": "⫨",
          "&vBarv;": "⫩",
          "&vDash;": "⊨",
          "&vangrt;": "⦜",
          "&varepsilon;": "ϵ",
          "&varkappa;": "ϰ",
          "&varnothing;": "∅",
          "&varphi;": "ϕ",
          "&varpi;": "ϖ",
          "&varpropto;": "∝",
          "&varr;": "↕",
          "&varrho;": "ϱ",
          "&varsigma;": "ς",
          "&varsubsetneq;": "⊊︀",
          "&varsubsetneqq;": "⫋︀",
          "&varsupsetneq;": "⊋︀",
          "&varsupsetneqq;": "⫌︀",
          "&vartheta;": "ϑ",
          "&vartriangleleft;": "⊲",
          "&vartriangleright;": "⊳",
          "&vcy;": "в",
          "&vdash;": "⊢",
          "&vee;": "∨",
          "&veebar;": "⊻",
          "&veeeq;": "≚",
          "&vellip;": "⋮",
          "&verbar;": "|",
          "&vert;": "|",
          "&vfr;": "𝔳",
          "&vltri;": "⊲",
          "&vnsub;": "⊂⃒",
          "&vnsup;": "⊃⃒",
          "&vopf;": "𝕧",
          "&vprop;": "∝",
          "&vrtri;": "⊳",
          "&vscr;": "𝓋",
          "&vsubnE;": "⫋︀",
          "&vsubne;": "⊊︀",
          "&vsupnE;": "⫌︀",
          "&vsupne;": "⊋︀",
          "&vzigzag;": "⦚",
          "&wcirc;": "ŵ",
          "&wedbar;": "⩟",
          "&wedge;": "∧",
          "&wedgeq;": "≙",
          "&weierp;": "℘",
          "&wfr;": "𝔴",
          "&wopf;": "𝕨",
          "&wp;": "℘",
          "&wr;": "≀",
          "&wreath;": "≀",
          "&wscr;": "𝓌",
          "&xcap;": "⋂",
          "&xcirc;": "◯",
          "&xcup;": "⋃",
          "&xdtri;": "▽",
          "&xfr;": "𝔵",
          "&xhArr;": "⟺",
          "&xharr;": "⟷",
          "&xi;": "ξ",
          "&xlArr;": "⟸",
          "&xlarr;": "⟵",
          "&xmap;": "⟼",
          "&xnis;": "⋻",
          "&xodot;": "⨀",
          "&xopf;": "𝕩",
          "&xoplus;": "⨁",
          "&xotime;": "⨂",
          "&xrArr;": "⟹",
          "&xrarr;": "⟶",
          "&xscr;": "𝓍",
          "&xsqcup;": "⨆",
          "&xuplus;": "⨄",
          "&xutri;": "△",
          "&xvee;": "⋁",
          "&xwedge;": "⋀",
          "&yacute": "ý",
          "&yacute;": "ý",
          "&yacy;": "я",
          "&ycirc;": "ŷ",
          "&ycy;": "ы",
          "&yen": "¥",
          "&yen;": "¥",
          "&yfr;": "𝔶",
          "&yicy;": "ї",
          "&yopf;": "𝕪",
          "&yscr;": "𝓎",
          "&yucy;": "ю",
          "&yuml": "ÿ",
          "&yuml;": "ÿ",
          "&zacute;": "ź",
          "&zcaron;": "ž",
          "&zcy;": "з",
          "&zdot;": "ż",
          "&zeetrf;": "ℨ",
          "&zeta;": "ζ",
          "&zfr;": "𝔷",
          "&zhcy;": "ж",
          "&zigrarr;": "⇝",
          "&zopf;": "𝕫",
          "&zscr;": "𝓏",
          "&zwj;": "‍",
          "&zwnj;": "‌"
      },
      "characters": {
          "Æ": "&AElig;",
          "&": "&amp;",
          "Á": "&Aacute;",
          "Ă": "&Abreve;",
          "Â": "&Acirc;",
          "А": "&Acy;",
          "𝔄": "&Afr;",
          "À": "&Agrave;",
          "Α": "&Alpha;",
          "Ā": "&Amacr;",
          "⩓": "&And;",
          "Ą": "&Aogon;",
          "𝔸": "&Aopf;",
          "⁡": "&af;",
          "Å": "&angst;",
          "𝒜": "&Ascr;",
          "≔": "&coloneq;",
          "Ã": "&Atilde;",
          "Ä": "&Auml;",
          "∖": "&ssetmn;",
          "⫧": "&Barv;",
          "⌆": "&doublebarwedge;",
          "Б": "&Bcy;",
          "∵": "&because;",
          "ℬ": "&bernou;",
          "Β": "&Beta;",
          "𝔅": "&Bfr;",
          "𝔹": "&Bopf;",
          "˘": "&breve;",
          "≎": "&bump;",
          "Ч": "&CHcy;",
          "©": "&copy;",
          "Ć": "&Cacute;",
          "⋒": "&Cap;",
          "ⅅ": "&DD;",
          "ℭ": "&Cfr;",
          "Č": "&Ccaron;",
          "Ç": "&Ccedil;",
          "Ĉ": "&Ccirc;",
          "∰": "&Cconint;",
          "Ċ": "&Cdot;",
          "¸": "&cedil;",
          "·": "&middot;",
          "Χ": "&Chi;",
          "⊙": "&odot;",
          "⊖": "&ominus;",
          "⊕": "&oplus;",
          "⊗": "&otimes;",
          "∲": "&cwconint;",
          "”": "&rdquor;",
          "’": "&rsquor;",
          "∷": "&Proportion;",
          "⩴": "&Colone;",
          "≡": "&equiv;",
          "∯": "&DoubleContourIntegral;",
          "∮": "&oint;",
          "ℂ": "&complexes;",
          "∐": "&coprod;",
          "∳": "&awconint;",
          "⨯": "&Cross;",
          "𝒞": "&Cscr;",
          "⋓": "&Cup;",
          "≍": "&asympeq;",
          "⤑": "&DDotrahd;",
          "Ђ": "&DJcy;",
          "Ѕ": "&DScy;",
          "Џ": "&DZcy;",
          "‡": "&ddagger;",
          "↡": "&Darr;",
          "⫤": "&DoubleLeftTee;",
          "Ď": "&Dcaron;",
          "Д": "&Dcy;",
          "∇": "&nabla;",
          "Δ": "&Delta;",
          "𝔇": "&Dfr;",
          "´": "&acute;",
          "˙": "&dot;",
          "˝": "&dblac;",
          "`": "&grave;",
          "˜": "&tilde;",
          "⋄": "&diamond;",
          "ⅆ": "&dd;",
          "𝔻": "&Dopf;",
          "¨": "&uml;",
          "⃜": "&DotDot;",
          "≐": "&esdot;",
          "⇓": "&dArr;",
          "⇐": "&lArr;",
          "⇔": "&iff;",
          "⟸": "&xlArr;",
          "⟺": "&xhArr;",
          "⟹": "&xrArr;",
          "⇒": "&rArr;",
          "⊨": "&vDash;",
          "⇑": "&uArr;",
          "⇕": "&vArr;",
          "∥": "&spar;",
          "↓": "&downarrow;",
          "⤓": "&DownArrowBar;",
          "⇵": "&duarr;",
          "̑": "&DownBreve;",
          "⥐": "&DownLeftRightVector;",
          "⥞": "&DownLeftTeeVector;",
          "↽": "&lhard;",
          "⥖": "&DownLeftVectorBar;",
          "⥟": "&DownRightTeeVector;",
          "⇁": "&rightharpoondown;",
          "⥗": "&DownRightVectorBar;",
          "⊤": "&top;",
          "↧": "&mapstodown;",
          "𝒟": "&Dscr;",
          "Đ": "&Dstrok;",
          "Ŋ": "&ENG;",
          "Ð": "&ETH;",
          "É": "&Eacute;",
          "Ě": "&Ecaron;",
          "Ê": "&Ecirc;",
          "Э": "&Ecy;",
          "Ė": "&Edot;",
          "𝔈": "&Efr;",
          "È": "&Egrave;",
          "∈": "&isinv;",
          "Ē": "&Emacr;",
          "◻": "&EmptySmallSquare;",
          "▫": "&EmptyVerySmallSquare;",
          "Ę": "&Eogon;",
          "𝔼": "&Eopf;",
          "Ε": "&Epsilon;",
          "⩵": "&Equal;",
          "≂": "&esim;",
          "⇌": "&rlhar;",
          "ℰ": "&expectation;",
          "⩳": "&Esim;",
          "Η": "&Eta;",
          "Ë": "&Euml;",
          "∃": "&exist;",
          "ⅇ": "&exponentiale;",
          "Ф": "&Fcy;",
          "𝔉": "&Ffr;",
          "◼": "&FilledSmallSquare;",
          "▪": "&squf;",
          "𝔽": "&Fopf;",
          "∀": "&forall;",
          "ℱ": "&Fscr;",
          "Ѓ": "&GJcy;",
          ">": "&gt;",
          "Γ": "&Gamma;",
          "Ϝ": "&Gammad;",
          "Ğ": "&Gbreve;",
          "Ģ": "&Gcedil;",
          "Ĝ": "&Gcirc;",
          "Г": "&Gcy;",
          "Ġ": "&Gdot;",
          "𝔊": "&Gfr;",
          "⋙": "&ggg;",
          "𝔾": "&Gopf;",
          "≥": "&geq;",
          "⋛": "&gtreqless;",
          "≧": "&geqq;",
          "⪢": "&GreaterGreater;",
          "≷": "&gtrless;",
          "⩾": "&ges;",
          "≳": "&gtrsim;",
          "𝒢": "&Gscr;",
          "≫": "&gg;",
          "Ъ": "&HARDcy;",
          "ˇ": "&caron;",
          "^": "&Hat;",
          "Ĥ": "&Hcirc;",
          "ℌ": "&Poincareplane;",
          "ℋ": "&hamilt;",
          "ℍ": "&quaternions;",
          "─": "&boxh;",
          "Ħ": "&Hstrok;",
          "≏": "&bumpeq;",
          "Е": "&IEcy;",
          "Ĳ": "&IJlig;",
          "Ё": "&IOcy;",
          "Í": "&Iacute;",
          "Î": "&Icirc;",
          "И": "&Icy;",
          "İ": "&Idot;",
          "ℑ": "&imagpart;",
          "Ì": "&Igrave;",
          "Ī": "&Imacr;",
          "ⅈ": "&ii;",
          "∬": "&Int;",
          "∫": "&int;",
          "⋂": "&xcap;",
          "⁣": "&ic;",
          "⁢": "&it;",
          "Į": "&Iogon;",
          "𝕀": "&Iopf;",
          "Ι": "&Iota;",
          "ℐ": "&imagline;",
          "Ĩ": "&Itilde;",
          "І": "&Iukcy;",
          "Ï": "&Iuml;",
          "Ĵ": "&Jcirc;",
          "Й": "&Jcy;",
          "𝔍": "&Jfr;",
          "𝕁": "&Jopf;",
          "𝒥": "&Jscr;",
          "Ј": "&Jsercy;",
          "Є": "&Jukcy;",
          "Х": "&KHcy;",
          "Ќ": "&KJcy;",
          "Κ": "&Kappa;",
          "Ķ": "&Kcedil;",
          "К": "&Kcy;",
          "𝔎": "&Kfr;",
          "𝕂": "&Kopf;",
          "𝒦": "&Kscr;",
          "Љ": "&LJcy;",
          "<": "&lt;",
          "Ĺ": "&Lacute;",
          "Λ": "&Lambda;",
          "⟪": "&Lang;",
          "ℒ": "&lagran;",
          "↞": "&twoheadleftarrow;",
          "Ľ": "&Lcaron;",
          "Ļ": "&Lcedil;",
          "Л": "&Lcy;",
          "⟨": "&langle;",
          "←": "&slarr;",
          "⇤": "&larrb;",
          "⇆": "&lrarr;",
          "⌈": "&lceil;",
          "⟦": "&lobrk;",
          "⥡": "&LeftDownTeeVector;",
          "⇃": "&downharpoonleft;",
          "⥙": "&LeftDownVectorBar;",
          "⌊": "&lfloor;",
          "↔": "&leftrightarrow;",
          "⥎": "&LeftRightVector;",
          "⊣": "&dashv;",
          "↤": "&mapstoleft;",
          "⥚": "&LeftTeeVector;",
          "⊲": "&vltri;",
          "⧏": "&LeftTriangleBar;",
          "⊴": "&trianglelefteq;",
          "⥑": "&LeftUpDownVector;",
          "⥠": "&LeftUpTeeVector;",
          "↿": "&upharpoonleft;",
          "⥘": "&LeftUpVectorBar;",
          "↼": "&lharu;",
          "⥒": "&LeftVectorBar;",
          "⋚": "&lesseqgtr;",
          "≦": "&leqq;",
          "≶": "&lg;",
          "⪡": "&LessLess;",
          "⩽": "&les;",
          "≲": "&lsim;",
          "𝔏": "&Lfr;",
          "⋘": "&Ll;",
          "⇚": "&lAarr;",
          "Ŀ": "&Lmidot;",
          "⟵": "&xlarr;",
          "⟷": "&xharr;",
          "⟶": "&xrarr;",
          "𝕃": "&Lopf;",
          "↙": "&swarrow;",
          "↘": "&searrow;",
          "↰": "&lsh;",
          "Ł": "&Lstrok;",
          "≪": "&ll;",
          "⤅": "&Map;",
          "М": "&Mcy;",
          " ": "&MediumSpace;",
          "ℳ": "&phmmat;",
          "𝔐": "&Mfr;",
          "∓": "&mp;",
          "𝕄": "&Mopf;",
          "Μ": "&Mu;",
          "Њ": "&NJcy;",
          "Ń": "&Nacute;",
          "Ň": "&Ncaron;",
          "Ņ": "&Ncedil;",
          "Н": "&Ncy;",
          "​": "&ZeroWidthSpace;",
          "\n": "&NewLine;",
          "𝔑": "&Nfr;",
          "⁠": "&NoBreak;",
          " ": "&nbsp;",
          "ℕ": "&naturals;",
          "⫬": "&Not;",
          "≢": "&nequiv;",
          "≭": "&NotCupCap;",
          "∦": "&nspar;",
          "∉": "&notinva;",
          "≠": "&ne;",
          "≂̸": "&nesim;",
          "∄": "&nexists;",
          "≯": "&ngtr;",
          "≱": "&ngeq;",
          "≧̸": "&ngeqq;",
          "≫̸": "&nGtv;",
          "≹": "&ntgl;",
          "⩾̸": "&nges;",
          "≵": "&ngsim;",
          "≎̸": "&nbump;",
          "≏̸": "&nbumpe;",
          "⋪": "&ntriangleleft;",
          "⧏̸": "&NotLeftTriangleBar;",
          "⋬": "&ntrianglelefteq;",
          "≮": "&nlt;",
          "≰": "&nleq;",
          "≸": "&ntlg;",
          "≪̸": "&nLtv;",
          "⩽̸": "&nles;",
          "≴": "&nlsim;",
          "⪢̸": "&NotNestedGreaterGreater;",
          "⪡̸": "&NotNestedLessLess;",
          "⊀": "&nprec;",
          "⪯̸": "&npreceq;",
          "⋠": "&nprcue;",
          "∌": "&notniva;",
          "⋫": "&ntriangleright;",
          "⧐̸": "&NotRightTriangleBar;",
          "⋭": "&ntrianglerighteq;",
          "⊏̸": "&NotSquareSubset;",
          "⋢": "&nsqsube;",
          "⊐̸": "&NotSquareSuperset;",
          "⋣": "&nsqsupe;",
          "⊂⃒": "&vnsub;",
          "⊈": "&nsubseteq;",
          "⊁": "&nsucc;",
          "⪰̸": "&nsucceq;",
          "⋡": "&nsccue;",
          "≿̸": "&NotSucceedsTilde;",
          "⊃⃒": "&vnsup;",
          "⊉": "&nsupseteq;",
          "≁": "&nsim;",
          "≄": "&nsimeq;",
          "≇": "&ncong;",
          "≉": "&napprox;",
          "∤": "&nsmid;",
          "𝒩": "&Nscr;",
          "Ñ": "&Ntilde;",
          "Ν": "&Nu;",
          "Œ": "&OElig;",
          "Ó": "&Oacute;",
          "Ô": "&Ocirc;",
          "О": "&Ocy;",
          "Ő": "&Odblac;",
          "𝔒": "&Ofr;",
          "Ò": "&Ograve;",
          "Ō": "&Omacr;",
          "Ω": "&ohm;",
          "Ο": "&Omicron;",
          "𝕆": "&Oopf;",
          "“": "&ldquo;",
          "‘": "&lsquo;",
          "⩔": "&Or;",
          "𝒪": "&Oscr;",
          "Ø": "&Oslash;",
          "Õ": "&Otilde;",
          "⨷": "&Otimes;",
          "Ö": "&Ouml;",
          "‾": "&oline;",
          "⏞": "&OverBrace;",
          "⎴": "&tbrk;",
          "⏜": "&OverParenthesis;",
          "∂": "&part;",
          "П": "&Pcy;",
          "𝔓": "&Pfr;",
          "Φ": "&Phi;",
          "Π": "&Pi;",
          "±": "&pm;",
          "ℙ": "&primes;",
          "⪻": "&Pr;",
          "≺": "&prec;",
          "⪯": "&preceq;",
          "≼": "&preccurlyeq;",
          "≾": "&prsim;",
          "″": "&Prime;",
          "∏": "&prod;",
          "∝": "&vprop;",
          "𝒫": "&Pscr;",
          "Ψ": "&Psi;",
          "\"": "&quot;",
          "𝔔": "&Qfr;",
          "ℚ": "&rationals;",
          "𝒬": "&Qscr;",
          "⤐": "&drbkarow;",
          "®": "&reg;",
          "Ŕ": "&Racute;",
          "⟫": "&Rang;",
          "↠": "&twoheadrightarrow;",
          "⤖": "&Rarrtl;",
          "Ř": "&Rcaron;",
          "Ŗ": "&Rcedil;",
          "Р": "&Rcy;",
          "ℜ": "&realpart;",
          "∋": "&niv;",
          "⇋": "&lrhar;",
          "⥯": "&duhar;",
          "Ρ": "&Rho;",
          "⟩": "&rangle;",
          "→": "&srarr;",
          "⇥": "&rarrb;",
          "⇄": "&rlarr;",
          "⌉": "&rceil;",
          "⟧": "&robrk;",
          "⥝": "&RightDownTeeVector;",
          "⇂": "&downharpoonright;",
          "⥕": "&RightDownVectorBar;",
          "⌋": "&rfloor;",
          "⊢": "&vdash;",
          "↦": "&mapsto;",
          "⥛": "&RightTeeVector;",
          "⊳": "&vrtri;",
          "⧐": "&RightTriangleBar;",
          "⊵": "&trianglerighteq;",
          "⥏": "&RightUpDownVector;",
          "⥜": "&RightUpTeeVector;",
          "↾": "&upharpoonright;",
          "⥔": "&RightUpVectorBar;",
          "⇀": "&rightharpoonup;",
          "⥓": "&RightVectorBar;",
          "ℝ": "&reals;",
          "⥰": "&RoundImplies;",
          "⇛": "&rAarr;",
          "ℛ": "&realine;",
          "↱": "&rsh;",
          "⧴": "&RuleDelayed;",
          "Щ": "&SHCHcy;",
          "Ш": "&SHcy;",
          "Ь": "&SOFTcy;",
          "Ś": "&Sacute;",
          "⪼": "&Sc;",
          "Š": "&Scaron;",
          "Ş": "&Scedil;",
          "Ŝ": "&Scirc;",
          "С": "&Scy;",
          "𝔖": "&Sfr;",
          "↑": "&uparrow;",
          "Σ": "&Sigma;",
          "∘": "&compfn;",
          "𝕊": "&Sopf;",
          "√": "&radic;",
          "□": "&square;",
          "⊓": "&sqcap;",
          "⊏": "&sqsubset;",
          "⊑": "&sqsubseteq;",
          "⊐": "&sqsupset;",
          "⊒": "&sqsupseteq;",
          "⊔": "&sqcup;",
          "𝒮": "&Sscr;",
          "⋆": "&sstarf;",
          "⋐": "&Subset;",
          "⊆": "&subseteq;",
          "≻": "&succ;",
          "⪰": "&succeq;",
          "≽": "&succcurlyeq;",
          "≿": "&succsim;",
          "∑": "&sum;",
          "⋑": "&Supset;",
          "⊃": "&supset;",
          "⊇": "&supseteq;",
          "Þ": "&THORN;",
          "™": "&trade;",
          "Ћ": "&TSHcy;",
          "Ц": "&TScy;",
          "\t": "&Tab;",
          "Τ": "&Tau;",
          "Ť": "&Tcaron;",
          "Ţ": "&Tcedil;",
          "Т": "&Tcy;",
          "𝔗": "&Tfr;",
          "∴": "&therefore;",
          "Θ": "&Theta;",
          "  ": "&ThickSpace;",
          " ": "&thinsp;",
          "∼": "&thksim;",
          "≃": "&simeq;",
          "≅": "&cong;",
          "≈": "&thkap;",
          "𝕋": "&Topf;",
          "⃛": "&tdot;",
          "𝒯": "&Tscr;",
          "Ŧ": "&Tstrok;",
          "Ú": "&Uacute;",
          "↟": "&Uarr;",
          "⥉": "&Uarrocir;",
          "Ў": "&Ubrcy;",
          "Ŭ": "&Ubreve;",
          "Û": "&Ucirc;",
          "У": "&Ucy;",
          "Ű": "&Udblac;",
          "𝔘": "&Ufr;",
          "Ù": "&Ugrave;",
          "Ū": "&Umacr;",
          "_": "&lowbar;",
          "⏟": "&UnderBrace;",
          "⎵": "&bbrk;",
          "⏝": "&UnderParenthesis;",
          "⋃": "&xcup;",
          "⊎": "&uplus;",
          "Ų": "&Uogon;",
          "𝕌": "&Uopf;",
          "⤒": "&UpArrowBar;",
          "⇅": "&udarr;",
          "↕": "&varr;",
          "⥮": "&udhar;",
          "⊥": "&perp;",
          "↥": "&mapstoup;",
          "↖": "&nwarrow;",
          "↗": "&nearrow;",
          "ϒ": "&upsih;",
          "Υ": "&Upsilon;",
          "Ů": "&Uring;",
          "𝒰": "&Uscr;",
          "Ũ": "&Utilde;",
          "Ü": "&Uuml;",
          "⊫": "&VDash;",
          "⫫": "&Vbar;",
          "В": "&Vcy;",
          "⊩": "&Vdash;",
          "⫦": "&Vdashl;",
          "⋁": "&xvee;",
          "‖": "&Vert;",
          "∣": "&smid;",
          "|": "&vert;",
          "❘": "&VerticalSeparator;",
          "≀": "&wreath;",
          " ": "&hairsp;",
          "𝔙": "&Vfr;",
          "𝕍": "&Vopf;",
          "𝒱": "&Vscr;",
          "⊪": "&Vvdash;",
          "Ŵ": "&Wcirc;",
          "⋀": "&xwedge;",
          "𝔚": "&Wfr;",
          "𝕎": "&Wopf;",
          "𝒲": "&Wscr;",
          "𝔛": "&Xfr;",
          "Ξ": "&Xi;",
          "𝕏": "&Xopf;",
          "𝒳": "&Xscr;",
          "Я": "&YAcy;",
          "Ї": "&YIcy;",
          "Ю": "&YUcy;",
          "Ý": "&Yacute;",
          "Ŷ": "&Ycirc;",
          "Ы": "&Ycy;",
          "𝔜": "&Yfr;",
          "𝕐": "&Yopf;",
          "𝒴": "&Yscr;",
          "Ÿ": "&Yuml;",
          "Ж": "&ZHcy;",
          "Ź": "&Zacute;",
          "Ž": "&Zcaron;",
          "З": "&Zcy;",
          "Ż": "&Zdot;",
          "Ζ": "&Zeta;",
          "ℨ": "&zeetrf;",
          "ℤ": "&integers;",
          "𝒵": "&Zscr;",
          "á": "&aacute;",
          "ă": "&abreve;",
          "∾": "&mstpos;",
          "∾̳": "&acE;",
          "∿": "&acd;",
          "â": "&acirc;",
          "а": "&acy;",
          "æ": "&aelig;",
          "𝔞": "&afr;",
          "à": "&agrave;",
          "ℵ": "&aleph;",
          "α": "&alpha;",
          "ā": "&amacr;",
          "⨿": "&amalg;",
          "∧": "&wedge;",
          "⩕": "&andand;",
          "⩜": "&andd;",
          "⩘": "&andslope;",
          "⩚": "&andv;",
          "∠": "&angle;",
          "⦤": "&ange;",
          "∡": "&measuredangle;",
          "⦨": "&angmsdaa;",
          "⦩": "&angmsdab;",
          "⦪": "&angmsdac;",
          "⦫": "&angmsdad;",
          "⦬": "&angmsdae;",
          "⦭": "&angmsdaf;",
          "⦮": "&angmsdag;",
          "⦯": "&angmsdah;",
          "∟": "&angrt;",
          "⊾": "&angrtvb;",
          "⦝": "&angrtvbd;",
          "∢": "&angsph;",
          "⍼": "&angzarr;",
          "ą": "&aogon;",
          "𝕒": "&aopf;",
          "⩰": "&apE;",
          "⩯": "&apacir;",
          "≊": "&approxeq;",
          "≋": "&apid;",
          "'": "&apos;",
          "å": "&aring;",
          "𝒶": "&ascr;",
          "*": "&midast;",
          "ã": "&atilde;",
          "ä": "&auml;",
          "⨑": "&awint;",
          "⫭": "&bNot;",
          "≌": "&bcong;",
          "϶": "&bepsi;",
          "‵": "&bprime;",
          "∽": "&bsim;",
          "⋍": "&bsime;",
          "⊽": "&barvee;",
          "⌅": "&barwedge;",
          "⎶": "&bbrktbrk;",
          "б": "&bcy;",
          "„": "&ldquor;",
          "⦰": "&bemptyv;",
          "β": "&beta;",
          "ℶ": "&beth;",
          "≬": "&twixt;",
          "𝔟": "&bfr;",
          "◯": "&xcirc;",
          "⨀": "&xodot;",
          "⨁": "&xoplus;",
          "⨂": "&xotime;",
          "⨆": "&xsqcup;",
          "★": "&starf;",
          "▽": "&xdtri;",
          "△": "&xutri;",
          "⨄": "&xuplus;",
          "⤍": "&rbarr;",
          "⧫": "&lozf;",
          "▴": "&utrif;",
          "▾": "&dtrif;",
          "◂": "&ltrif;",
          "▸": "&rtrif;",
          "␣": "&blank;",
          "▒": "&blk12;",
          "░": "&blk14;",
          "▓": "&blk34;",
          "█": "&block;",
          "=⃥": "&bne;",
          "≡⃥": "&bnequiv;",
          "⌐": "&bnot;",
          "𝕓": "&bopf;",
          "⋈": "&bowtie;",
          "╗": "&boxDL;",
          "╔": "&boxDR;",
          "╖": "&boxDl;",
          "╓": "&boxDr;",
          "═": "&boxH;",
          "╦": "&boxHD;",
          "╩": "&boxHU;",
          "╤": "&boxHd;",
          "╧": "&boxHu;",
          "╝": "&boxUL;",
          "╚": "&boxUR;",
          "╜": "&boxUl;",
          "╙": "&boxUr;",
          "║": "&boxV;",
          "╬": "&boxVH;",
          "╣": "&boxVL;",
          "╠": "&boxVR;",
          "╫": "&boxVh;",
          "╢": "&boxVl;",
          "╟": "&boxVr;",
          "⧉": "&boxbox;",
          "╕": "&boxdL;",
          "╒": "&boxdR;",
          "┐": "&boxdl;",
          "┌": "&boxdr;",
          "╥": "&boxhD;",
          "╨": "&boxhU;",
          "┬": "&boxhd;",
          "┴": "&boxhu;",
          "⊟": "&minusb;",
          "⊞": "&plusb;",
          "⊠": "&timesb;",
          "╛": "&boxuL;",
          "╘": "&boxuR;",
          "┘": "&boxul;",
          "└": "&boxur;",
          "│": "&boxv;",
          "╪": "&boxvH;",
          "╡": "&boxvL;",
          "╞": "&boxvR;",
          "┼": "&boxvh;",
          "┤": "&boxvl;",
          "├": "&boxvr;",
          "¦": "&brvbar;",
          "𝒷": "&bscr;",
          "⁏": "&bsemi;",
          "\\": "&bsol;",
          "⧅": "&bsolb;",
          "⟈": "&bsolhsub;",
          "•": "&bullet;",
          "⪮": "&bumpE;",
          "ć": "&cacute;",
          "∩": "&cap;",
          "⩄": "&capand;",
          "⩉": "&capbrcup;",
          "⩋": "&capcap;",
          "⩇": "&capcup;",
          "⩀": "&capdot;",
          "∩︀": "&caps;",
          "⁁": "&caret;",
          "⩍": "&ccaps;",
          "č": "&ccaron;",
          "ç": "&ccedil;",
          "ĉ": "&ccirc;",
          "⩌": "&ccups;",
          "⩐": "&ccupssm;",
          "ċ": "&cdot;",
          "⦲": "&cemptyv;",
          "¢": "&cent;",
          "𝔠": "&cfr;",
          "ч": "&chcy;",
          "✓": "&checkmark;",
          "χ": "&chi;",
          "○": "&cir;",
          "⧃": "&cirE;",
          "ˆ": "&circ;",
          "≗": "&cire;",
          "↺": "&olarr;",
          "↻": "&orarr;",
          "Ⓢ": "&oS;",
          "⊛": "&oast;",
          "⊚": "&ocir;",
          "⊝": "&odash;",
          "⨐": "&cirfnint;",
          "⫯": "&cirmid;",
          "⧂": "&cirscir;",
          "♣": "&clubsuit;",
          ":": "&colon;",
          ",": "&comma;",
          "@": "&commat;",
          "∁": "&complement;",
          "⩭": "&congdot;",
          "𝕔": "&copf;",
          "℗": "&copysr;",
          "↵": "&crarr;",
          "✗": "&cross;",
          "𝒸": "&cscr;",
          "⫏": "&csub;",
          "⫑": "&csube;",
          "⫐": "&csup;",
          "⫒": "&csupe;",
          "⋯": "&ctdot;",
          "⤸": "&cudarrl;",
          "⤵": "&cudarrr;",
          "⋞": "&curlyeqprec;",
          "⋟": "&curlyeqsucc;",
          "↶": "&curvearrowleft;",
          "⤽": "&cularrp;",
          "∪": "&cup;",
          "⩈": "&cupbrcap;",
          "⩆": "&cupcap;",
          "⩊": "&cupcup;",
          "⊍": "&cupdot;",
          "⩅": "&cupor;",
          "∪︀": "&cups;",
          "↷": "&curvearrowright;",
          "⤼": "&curarrm;",
          "⋎": "&cuvee;",
          "⋏": "&cuwed;",
          "¤": "&curren;",
          "∱": "&cwint;",
          "⌭": "&cylcty;",
          "⥥": "&dHar;",
          "†": "&dagger;",
          "ℸ": "&daleth;",
          "‐": "&hyphen;",
          "⤏": "&rBarr;",
          "ď": "&dcaron;",
          "д": "&dcy;",
          "⇊": "&downdownarrows;",
          "⩷": "&eDDot;",
          "°": "&deg;",
          "δ": "&delta;",
          "⦱": "&demptyv;",
          "⥿": "&dfisht;",
          "𝔡": "&dfr;",
          "♦": "&diams;",
          "ϝ": "&gammad;",
          "⋲": "&disin;",
          "÷": "&divide;",
          "⋇": "&divonx;",
          "ђ": "&djcy;",
          "⌞": "&llcorner;",
          "⌍": "&dlcrop;",
          "$": "&dollar;",
          "𝕕": "&dopf;",
          "≑": "&eDot;",
          "∸": "&minusd;",
          "∔": "&plusdo;",
          "⊡": "&sdotb;",
          "⌟": "&lrcorner;",
          "⌌": "&drcrop;",
          "𝒹": "&dscr;",
          "ѕ": "&dscy;",
          "⧶": "&dsol;",
          "đ": "&dstrok;",
          "⋱": "&dtdot;",
          "▿": "&triangledown;",
          "⦦": "&dwangle;",
          "џ": "&dzcy;",
          "⟿": "&dzigrarr;",
          "é": "&eacute;",
          "⩮": "&easter;",
          "ě": "&ecaron;",
          "≖": "&eqcirc;",
          "ê": "&ecirc;",
          "≕": "&eqcolon;",
          "э": "&ecy;",
          "ė": "&edot;",
          "≒": "&fallingdotseq;",
          "𝔢": "&efr;",
          "⪚": "&eg;",
          "è": "&egrave;",
          "⪖": "&eqslantgtr;",
          "⪘": "&egsdot;",
          "⪙": "&el;",
          "⏧": "&elinters;",
          "ℓ": "&ell;",
          "⪕": "&eqslantless;",
          "⪗": "&elsdot;",
          "ē": "&emacr;",
          "∅": "&varnothing;",
          " ": "&emsp13;",
          " ": "&emsp14;",
          " ": "&emsp;",
          "ŋ": "&eng;",
          " ": "&ensp;",
          "ę": "&eogon;",
          "𝕖": "&eopf;",
          "⋕": "&epar;",
          "⧣": "&eparsl;",
          "⩱": "&eplus;",
          "ε": "&epsilon;",
          "ϵ": "&varepsilon;",
          "=": "&equals;",
          "≟": "&questeq;",
          "⩸": "&equivDD;",
          "⧥": "&eqvparsl;",
          "≓": "&risingdotseq;",
          "⥱": "&erarr;",
          "ℯ": "&escr;",
          "η": "&eta;",
          "ð": "&eth;",
          "ë": "&euml;",
          "€": "&euro;",
          "!": "&excl;",
          "ф": "&fcy;",
          "♀": "&female;",
          "ﬃ": "&ffilig;",
          "ﬀ": "&fflig;",
          "ﬄ": "&ffllig;",
          "𝔣": "&ffr;",
          "ﬁ": "&filig;",
          "fj": "&fjlig;",
          "♭": "&flat;",
          "ﬂ": "&fllig;",
          "▱": "&fltns;",
          "ƒ": "&fnof;",
          "𝕗": "&fopf;",
          "⋔": "&pitchfork;",
          "⫙": "&forkv;",
          "⨍": "&fpartint;",
          "½": "&half;",
          "⅓": "&frac13;",
          "¼": "&frac14;",
          "⅕": "&frac15;",
          "⅙": "&frac16;",
          "⅛": "&frac18;",
          "⅔": "&frac23;",
          "⅖": "&frac25;",
          "¾": "&frac34;",
          "⅗": "&frac35;",
          "⅜": "&frac38;",
          "⅘": "&frac45;",
          "⅚": "&frac56;",
          "⅝": "&frac58;",
          "⅞": "&frac78;",
          "⁄": "&frasl;",
          "⌢": "&sfrown;",
          "𝒻": "&fscr;",
          "⪌": "&gtreqqless;",
          "ǵ": "&gacute;",
          "γ": "&gamma;",
          "⪆": "&gtrapprox;",
          "ğ": "&gbreve;",
          "ĝ": "&gcirc;",
          "г": "&gcy;",
          "ġ": "&gdot;",
          "⪩": "&gescc;",
          "⪀": "&gesdot;",
          "⪂": "&gesdoto;",
          "⪄": "&gesdotol;",
          "⋛︀": "&gesl;",
          "⪔": "&gesles;",
          "𝔤": "&gfr;",
          "ℷ": "&gimel;",
          "ѓ": "&gjcy;",
          "⪒": "&glE;",
          "⪥": "&gla;",
          "⪤": "&glj;",
          "≩": "&gneqq;",
          "⪊": "&gnapprox;",
          "⪈": "&gneq;",
          "⋧": "&gnsim;",
          "𝕘": "&gopf;",
          "ℊ": "&gscr;",
          "⪎": "&gsime;",
          "⪐": "&gsiml;",
          "⪧": "&gtcc;",
          "⩺": "&gtcir;",
          "⋗": "&gtrdot;",
          "⦕": "&gtlPar;",
          "⩼": "&gtquest;",
          "⥸": "&gtrarr;",
          "≩︀": "&gvnE;",
          "ъ": "&hardcy;",
          "⥈": "&harrcir;",
          "↭": "&leftrightsquigarrow;",
          "ℏ": "&plankv;",
          "ĥ": "&hcirc;",
          "♥": "&heartsuit;",
          "…": "&mldr;",
          "⊹": "&hercon;",
          "𝔥": "&hfr;",
          "⤥": "&searhk;",
          "⤦": "&swarhk;",
          "⇿": "&hoarr;",
          "∻": "&homtht;",
          "↩": "&larrhk;",
          "↪": "&rarrhk;",
          "𝕙": "&hopf;",
          "―": "&horbar;",
          "𝒽": "&hscr;",
          "ħ": "&hstrok;",
          "⁃": "&hybull;",
          "í": "&iacute;",
          "î": "&icirc;",
          "и": "&icy;",
          "е": "&iecy;",
          "¡": "&iexcl;",
          "𝔦": "&ifr;",
          "ì": "&igrave;",
          "⨌": "&qint;",
          "∭": "&tint;",
          "⧜": "&iinfin;",
          "℩": "&iiota;",
          "ĳ": "&ijlig;",
          "ī": "&imacr;",
          "ı": "&inodot;",
          "⊷": "&imof;",
          "Ƶ": "&imped;",
          "℅": "&incare;",
          "∞": "&infin;",
          "⧝": "&infintie;",
          "⊺": "&intercal;",
          "⨗": "&intlarhk;",
          "⨼": "&iprod;",
          "ё": "&iocy;",
          "į": "&iogon;",
          "𝕚": "&iopf;",
          "ι": "&iota;",
          "¿": "&iquest;",
          "𝒾": "&iscr;",
          "⋹": "&isinE;",
          "⋵": "&isindot;",
          "⋴": "&isins;",
          "⋳": "&isinsv;",
          "ĩ": "&itilde;",
          "і": "&iukcy;",
          "ï": "&iuml;",
          "ĵ": "&jcirc;",
          "й": "&jcy;",
          "𝔧": "&jfr;",
          "ȷ": "&jmath;",
          "𝕛": "&jopf;",
          "𝒿": "&jscr;",
          "ј": "&jsercy;",
          "є": "&jukcy;",
          "κ": "&kappa;",
          "ϰ": "&varkappa;",
          "ķ": "&kcedil;",
          "к": "&kcy;",
          "𝔨": "&kfr;",
          "ĸ": "&kgreen;",
          "х": "&khcy;",
          "ќ": "&kjcy;",
          "𝕜": "&kopf;",
          "𝓀": "&kscr;",
          "⤛": "&lAtail;",
          "⤎": "&lBarr;",
          "⪋": "&lesseqqgtr;",
          "⥢": "&lHar;",
          "ĺ": "&lacute;",
          "⦴": "&laemptyv;",
          "λ": "&lambda;",
          "⦑": "&langd;",
          "⪅": "&lessapprox;",
          "«": "&laquo;",
          "⤟": "&larrbfs;",
          "⤝": "&larrfs;",
          "↫": "&looparrowleft;",
          "⤹": "&larrpl;",
          "⥳": "&larrsim;",
          "↢": "&leftarrowtail;",
          "⪫": "&lat;",
          "⤙": "&latail;",
          "⪭": "&late;",
          "⪭︀": "&lates;",
          "⤌": "&lbarr;",
          "❲": "&lbbrk;",
          "{": "&lcub;",
          "[": "&lsqb;",
          "⦋": "&lbrke;",
          "⦏": "&lbrksld;",
          "⦍": "&lbrkslu;",
          "ľ": "&lcaron;",
          "ļ": "&lcedil;",
          "л": "&lcy;",
          "⤶": "&ldca;",
          "⥧": "&ldrdhar;",
          "⥋": "&ldrushar;",
          "↲": "&ldsh;",
          "≤": "&leq;",
          "⇇": "&llarr;",
          "⋋": "&lthree;",
          "⪨": "&lescc;",
          "⩿": "&lesdot;",
          "⪁": "&lesdoto;",
          "⪃": "&lesdotor;",
          "⋚︀": "&lesg;",
          "⪓": "&lesges;",
          "⋖": "&ltdot;",
          "⥼": "&lfisht;",
          "𝔩": "&lfr;",
          "⪑": "&lgE;",
          "⥪": "&lharul;",
          "▄": "&lhblk;",
          "љ": "&ljcy;",
          "⥫": "&llhard;",
          "◺": "&lltri;",
          "ŀ": "&lmidot;",
          "⎰": "&lmoustache;",
          "≨": "&lneqq;",
          "⪉": "&lnapprox;",
          "⪇": "&lneq;",
          "⋦": "&lnsim;",
          "⟬": "&loang;",
          "⇽": "&loarr;",
          "⟼": "&xmap;",
          "↬": "&rarrlp;",
          "⦅": "&lopar;",
          "𝕝": "&lopf;",
          "⨭": "&loplus;",
          "⨴": "&lotimes;",
          "∗": "&lowast;",
          "◊": "&lozenge;",
          "(": "&lpar;",
          "⦓": "&lparlt;",
          "⥭": "&lrhard;",
          "‎": "&lrm;",
          "⊿": "&lrtri;",
          "‹": "&lsaquo;",
          "𝓁": "&lscr;",
          "⪍": "&lsime;",
          "⪏": "&lsimg;",
          "‚": "&sbquo;",
          "ł": "&lstrok;",
          "⪦": "&ltcc;",
          "⩹": "&ltcir;",
          "⋉": "&ltimes;",
          "⥶": "&ltlarr;",
          "⩻": "&ltquest;",
          "⦖": "&ltrPar;",
          "◃": "&triangleleft;",
          "⥊": "&lurdshar;",
          "⥦": "&luruhar;",
          "≨︀": "&lvnE;",
          "∺": "&mDDot;",
          "¯": "&strns;",
          "♂": "&male;",
          "✠": "&maltese;",
          "▮": "&marker;",
          "⨩": "&mcomma;",
          "м": "&mcy;",
          "—": "&mdash;",
          "𝔪": "&mfr;",
          "℧": "&mho;",
          "µ": "&micro;",
          "⫰": "&midcir;",
          "−": "&minus;",
          "⨪": "&minusdu;",
          "⫛": "&mlcp;",
          "⊧": "&models;",
          "𝕞": "&mopf;",
          "𝓂": "&mscr;",
          "μ": "&mu;",
          "⊸": "&mumap;",
          "⋙̸": "&nGg;",
          "≫⃒": "&nGt;",
          "⇍": "&nlArr;",
          "⇎": "&nhArr;",
          "⋘̸": "&nLl;",
          "≪⃒": "&nLt;",
          "⇏": "&nrArr;",
          "⊯": "&nVDash;",
          "⊮": "&nVdash;",
          "ń": "&nacute;",
          "∠⃒": "&nang;",
          "⩰̸": "&napE;",
          "≋̸": "&napid;",
          "ŉ": "&napos;",
          "♮": "&natural;",
          "⩃": "&ncap;",
          "ň": "&ncaron;",
          "ņ": "&ncedil;",
          "⩭̸": "&ncongdot;",
          "⩂": "&ncup;",
          "н": "&ncy;",
          "–": "&ndash;",
          "⇗": "&neArr;",
          "⤤": "&nearhk;",
          "≐̸": "&nedot;",
          "⤨": "&toea;",
          "𝔫": "&nfr;",
          "↮": "&nleftrightarrow;",
          "⫲": "&nhpar;",
          "⋼": "&nis;",
          "⋺": "&nisd;",
          "њ": "&njcy;",
          "≦̸": "&nleqq;",
          "↚": "&nleftarrow;",
          "‥": "&nldr;",
          "𝕟": "&nopf;",
          "¬": "&not;",
          "⋹̸": "&notinE;",
          "⋵̸": "&notindot;",
          "⋷": "&notinvb;",
          "⋶": "&notinvc;",
          "⋾": "&notnivb;",
          "⋽": "&notnivc;",
          "⫽⃥": "&nparsl;",
          "∂̸": "&npart;",
          "⨔": "&npolint;",
          "↛": "&nrightarrow;",
          "⤳̸": "&nrarrc;",
          "↝̸": "&nrarrw;",
          "𝓃": "&nscr;",
          "⊄": "&nsub;",
          "⫅̸": "&nsubseteqq;",
          "⊅": "&nsup;",
          "⫆̸": "&nsupseteqq;",
          "ñ": "&ntilde;",
          "ν": "&nu;",
          "#": "&num;",
          "№": "&numero;",
          " ": "&numsp;",
          "⊭": "&nvDash;",
          "⤄": "&nvHarr;",
          "≍⃒": "&nvap;",
          "⊬": "&nvdash;",
          "≥⃒": "&nvge;",
          ">⃒": "&nvgt;",
          "⧞": "&nvinfin;",
          "⤂": "&nvlArr;",
          "≤⃒": "&nvle;",
          "<⃒": "&nvlt;",
          "⊴⃒": "&nvltrie;",
          "⤃": "&nvrArr;",
          "⊵⃒": "&nvrtrie;",
          "∼⃒": "&nvsim;",
          "⇖": "&nwArr;",
          "⤣": "&nwarhk;",
          "⤧": "&nwnear;",
          "ó": "&oacute;",
          "ô": "&ocirc;",
          "о": "&ocy;",
          "ő": "&odblac;",
          "⨸": "&odiv;",
          "⦼": "&odsold;",
          "œ": "&oelig;",
          "⦿": "&ofcir;",
          "𝔬": "&ofr;",
          "˛": "&ogon;",
          "ò": "&ograve;",
          "⧁": "&ogt;",
          "⦵": "&ohbar;",
          "⦾": "&olcir;",
          "⦻": "&olcross;",
          "⧀": "&olt;",
          "ō": "&omacr;",
          "ω": "&omega;",
          "ο": "&omicron;",
          "⦶": "&omid;",
          "𝕠": "&oopf;",
          "⦷": "&opar;",
          "⦹": "&operp;",
          "∨": "&vee;",
          "⩝": "&ord;",
          "ℴ": "&oscr;",
          "ª": "&ordf;",
          "º": "&ordm;",
          "⊶": "&origof;",
          "⩖": "&oror;",
          "⩗": "&orslope;",
          "⩛": "&orv;",
          "ø": "&oslash;",
          "⊘": "&osol;",
          "õ": "&otilde;",
          "⨶": "&otimesas;",
          "ö": "&ouml;",
          "⌽": "&ovbar;",
          "¶": "&para;",
          "⫳": "&parsim;",
          "⫽": "&parsl;",
          "п": "&pcy;",
          "%": "&percnt;",
          ".": "&period;",
          "‰": "&permil;",
          "‱": "&pertenk;",
          "𝔭": "&pfr;",
          "φ": "&phi;",
          "ϕ": "&varphi;",
          "☎": "&phone;",
          "π": "&pi;",
          "ϖ": "&varpi;",
          "ℎ": "&planckh;",
          "+": "&plus;",
          "⨣": "&plusacir;",
          "⨢": "&pluscir;",
          "⨥": "&plusdu;",
          "⩲": "&pluse;",
          "⨦": "&plussim;",
          "⨧": "&plustwo;",
          "⨕": "&pointint;",
          "𝕡": "&popf;",
          "£": "&pound;",
          "⪳": "&prE;",
          "⪷": "&precapprox;",
          "⪹": "&prnap;",
          "⪵": "&prnE;",
          "⋨": "&prnsim;",
          "′": "&prime;",
          "⌮": "&profalar;",
          "⌒": "&profline;",
          "⌓": "&profsurf;",
          "⊰": "&prurel;",
          "𝓅": "&pscr;",
          "ψ": "&psi;",
          " ": "&puncsp;",
          "𝔮": "&qfr;",
          "𝕢": "&qopf;",
          "⁗": "&qprime;",
          "𝓆": "&qscr;",
          "⨖": "&quatint;",
          "?": "&quest;",
          "⤜": "&rAtail;",
          "⥤": "&rHar;",
          "∽̱": "&race;",
          "ŕ": "&racute;",
          "⦳": "&raemptyv;",
          "⦒": "&rangd;",
          "⦥": "&range;",
          "»": "&raquo;",
          "⥵": "&rarrap;",
          "⤠": "&rarrbfs;",
          "⤳": "&rarrc;",
          "⤞": "&rarrfs;",
          "⥅": "&rarrpl;",
          "⥴": "&rarrsim;",
          "↣": "&rightarrowtail;",
          "↝": "&rightsquigarrow;",
          "⤚": "&ratail;",
          "∶": "&ratio;",
          "❳": "&rbbrk;",
          "}": "&rcub;",
          "]": "&rsqb;",
          "⦌": "&rbrke;",
          "⦎": "&rbrksld;",
          "⦐": "&rbrkslu;",
          "ř": "&rcaron;",
          "ŗ": "&rcedil;",
          "р": "&rcy;",
          "⤷": "&rdca;",
          "⥩": "&rdldhar;",
          "↳": "&rdsh;",
          "▭": "&rect;",
          "⥽": "&rfisht;",
          "𝔯": "&rfr;",
          "⥬": "&rharul;",
          "ρ": "&rho;",
          "ϱ": "&varrho;",
          "⇉": "&rrarr;",
          "⋌": "&rthree;",
          "˚": "&ring;",
          "‏": "&rlm;",
          "⎱": "&rmoustache;",
          "⫮": "&rnmid;",
          "⟭": "&roang;",
          "⇾": "&roarr;",
          "⦆": "&ropar;",
          "𝕣": "&ropf;",
          "⨮": "&roplus;",
          "⨵": "&rotimes;",
          ")": "&rpar;",
          "⦔": "&rpargt;",
          "⨒": "&rppolint;",
          "›": "&rsaquo;",
          "𝓇": "&rscr;",
          "⋊": "&rtimes;",
          "▹": "&triangleright;",
          "⧎": "&rtriltri;",
          "⥨": "&ruluhar;",
          "℞": "&rx;",
          "ś": "&sacute;",
          "⪴": "&scE;",
          "⪸": "&succapprox;",
          "š": "&scaron;",
          "ş": "&scedil;",
          "ŝ": "&scirc;",
          "⪶": "&succneqq;",
          "⪺": "&succnapprox;",
          "⋩": "&succnsim;",
          "⨓": "&scpolint;",
          "с": "&scy;",
          "⋅": "&sdot;",
          "⩦": "&sdote;",
          "⇘": "&seArr;",
          "§": "&sect;",
          ";": "&semi;",
          "⤩": "&tosa;",
          "✶": "&sext;",
          "𝔰": "&sfr;",
          "♯": "&sharp;",
          "щ": "&shchcy;",
          "ш": "&shcy;",
          "­": "&shy;",
          "σ": "&sigma;",
          "ς": "&varsigma;",
          "⩪": "&simdot;",
          "⪞": "&simg;",
          "⪠": "&simgE;",
          "⪝": "&siml;",
          "⪟": "&simlE;",
          "≆": "&simne;",
          "⨤": "&simplus;",
          "⥲": "&simrarr;",
          "⨳": "&smashp;",
          "⧤": "&smeparsl;",
          "⌣": "&ssmile;",
          "⪪": "&smt;",
          "⪬": "&smte;",
          "⪬︀": "&smtes;",
          "ь": "&softcy;",
          "/": "&sol;",
          "⧄": "&solb;",
          "⌿": "&solbar;",
          "𝕤": "&sopf;",
          "♠": "&spadesuit;",
          "⊓︀": "&sqcaps;",
          "⊔︀": "&sqcups;",
          "𝓈": "&sscr;",
          "☆": "&star;",
          "⊂": "&subset;",
          "⫅": "&subseteqq;",
          "⪽": "&subdot;",
          "⫃": "&subedot;",
          "⫁": "&submult;",
          "⫋": "&subsetneqq;",
          "⊊": "&subsetneq;",
          "⪿": "&subplus;",
          "⥹": "&subrarr;",
          "⫇": "&subsim;",
          "⫕": "&subsub;",
          "⫓": "&subsup;",
          "♪": "&sung;",
          "¹": "&sup1;",
          "²": "&sup2;",
          "³": "&sup3;",
          "⫆": "&supseteqq;",
          "⪾": "&supdot;",
          "⫘": "&supdsub;",
          "⫄": "&supedot;",
          "⟉": "&suphsol;",
          "⫗": "&suphsub;",
          "⥻": "&suplarr;",
          "⫂": "&supmult;",
          "⫌": "&supsetneqq;",
          "⊋": "&supsetneq;",
          "⫀": "&supplus;",
          "⫈": "&supsim;",
          "⫔": "&supsub;",
          "⫖": "&supsup;",
          "⇙": "&swArr;",
          "⤪": "&swnwar;",
          "ß": "&szlig;",
          "⌖": "&target;",
          "τ": "&tau;",
          "ť": "&tcaron;",
          "ţ": "&tcedil;",
          "т": "&tcy;",
          "⌕": "&telrec;",
          "𝔱": "&tfr;",
          "θ": "&theta;",
          "ϑ": "&vartheta;",
          "þ": "&thorn;",
          "×": "&times;",
          "⨱": "&timesbar;",
          "⨰": "&timesd;",
          "⌶": "&topbot;",
          "⫱": "&topcir;",
          "𝕥": "&topf;",
          "⫚": "&topfork;",
          "‴": "&tprime;",
          "▵": "&utri;",
          "≜": "&trie;",
          "◬": "&tridot;",
          "⨺": "&triminus;",
          "⨹": "&triplus;",
          "⧍": "&trisb;",
          "⨻": "&tritime;",
          "⏢": "&trpezium;",
          "𝓉": "&tscr;",
          "ц": "&tscy;",
          "ћ": "&tshcy;",
          "ŧ": "&tstrok;",
          "⥣": "&uHar;",
          "ú": "&uacute;",
          "ў": "&ubrcy;",
          "ŭ": "&ubreve;",
          "û": "&ucirc;",
          "у": "&ucy;",
          "ű": "&udblac;",
          "⥾": "&ufisht;",
          "𝔲": "&ufr;",
          "ù": "&ugrave;",
          "▀": "&uhblk;",
          "⌜": "&ulcorner;",
          "⌏": "&ulcrop;",
          "◸": "&ultri;",
          "ū": "&umacr;",
          "ų": "&uogon;",
          "𝕦": "&uopf;",
          "υ": "&upsilon;",
          "⇈": "&uuarr;",
          "⌝": "&urcorner;",
          "⌎": "&urcrop;",
          "ů": "&uring;",
          "◹": "&urtri;",
          "𝓊": "&uscr;",
          "⋰": "&utdot;",
          "ũ": "&utilde;",
          "ü": "&uuml;",
          "⦧": "&uwangle;",
          "⫨": "&vBar;",
          "⫩": "&vBarv;",
          "⦜": "&vangrt;",
          "⊊︀": "&vsubne;",
          "⫋︀": "&vsubnE;",
          "⊋︀": "&vsupne;",
          "⫌︀": "&vsupnE;",
          "в": "&vcy;",
          "⊻": "&veebar;",
          "≚": "&veeeq;",
          "⋮": "&vellip;",
          "𝔳": "&vfr;",
          "𝕧": "&vopf;",
          "𝓋": "&vscr;",
          "⦚": "&vzigzag;",
          "ŵ": "&wcirc;",
          "⩟": "&wedbar;",
          "≙": "&wedgeq;",
          "℘": "&wp;",
          "𝔴": "&wfr;",
          "𝕨": "&wopf;",
          "𝓌": "&wscr;",
          "𝔵": "&xfr;",
          "ξ": "&xi;",
          "⋻": "&xnis;",
          "𝕩": "&xopf;",
          "𝓍": "&xscr;",
          "ý": "&yacute;",
          "я": "&yacy;",
          "ŷ": "&ycirc;",
          "ы": "&ycy;",
          "¥": "&yen;",
          "𝔶": "&yfr;",
          "ї": "&yicy;",
          "𝕪": "&yopf;",
          "𝓎": "&yscr;",
          "ю": "&yucy;",
          "ÿ": "&yuml;",
          "ź": "&zacute;",
          "ž": "&zcaron;",
          "з": "&zcy;",
          "ż": "&zdot;",
          "ζ": "&zeta;",
          "𝔷": "&zfr;",
          "ж": "&zhcy;",
          "⇝": "&zigrarr;",
          "𝕫": "&zopf;",
          "𝓏": "&zscr;",
          "‍": "&zwj;",
          "‌": "&zwnj;"
      }
  }
};


/***/ }),

/***/ "../node_modules/html-entities/lib/numeric-unicode-map.js":
/*!****************************************************************!*\
!*** ../node_modules/html-entities/lib/numeric-unicode-map.js ***!
\****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.numericUnicodeMap = {
  0: 65533,
  128: 8364,
  130: 8218,
  131: 402,
  132: 8222,
  133: 8230,
  134: 8224,
  135: 8225,
  136: 710,
  137: 8240,
  138: 352,
  139: 8249,
  140: 338,
  142: 381,
  145: 8216,
  146: 8217,
  147: 8220,
  148: 8221,
  149: 8226,
  150: 8211,
  151: 8212,
  152: 732,
  153: 8482,
  154: 353,
  155: 8250,
  156: 339,
  158: 382,
  159: 376
};


/***/ }),

/***/ "../node_modules/html-entities/lib/surrogate-pairs.js":
/*!************************************************************!*\
!*** ../node_modules/html-entities/lib/surrogate-pairs.js ***!
\************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromCodePoint = String.fromCodePoint ||
  function (astralCodePoint) {
      return String.fromCharCode(Math.floor((astralCodePoint - 0x10000) / 0x400) + 0xd800, ((astralCodePoint - 0x10000) % 0x400) + 0xdc00);
  };
exports.getCodePoint = String.prototype.codePointAt
  ? function (input, position) {
      return input.codePointAt(position);
  }
  : function (input, position) {
      return (input.charCodeAt(position) - 0xd800) * 0x400 + input.charCodeAt(position + 1) - 0xdc00 + 0x10000;
  };
exports.highSurrogateFrom = 0xd800;
exports.highSurrogateTo = 0xdbff;


/***/ }),

/***/ "../node_modules/strip-ansi/index.js":
/*!*******************************************!*\
!*** ../node_modules/strip-ansi/index.js ***!
\*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const ansiRegex = __webpack_require__(/*! ansi-regex */ "../node_modules/ansi-regex/index.js");

module.exports = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;


/***/ }),

/***/ "../process-update.js":
/*!****************************!*\
!*** ../process-update.js ***!
\****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
* Based heavily on https://github.com/webpack/webpack/blob/
*  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
* Original copyright Tobias Koppers @sokra (MIT license)
*/

/* global window __webpack_hash__ */

if (false) {}

var hmrDocsUrl = 'https://webpack.js.org/concepts/hot-module-replacement/'; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = {
ignoreUnaccepted: true,
ignoreDeclined: true,
ignoreErrored: true,
onUnaccepted: function (data) {
  console.warn(
    'Ignored an update to unaccepted module ' + data.chain.join(' -> ')
  );
},
onDeclined: function (data) {
  console.warn(
    'Ignored an update to declined module ' + data.chain.join(' -> ')
  );
},
onErrored: function (data) {
  console.error(data.error);
  console.warn(
    'Ignored an error while updating module ' +
      data.moduleId +
      ' (' +
      data.type +
      ')'
  );
},
};

function upToDate(hash) {
if (hash) lastHash = hash;
// __webpack_hash__ 提供对编译过程中(compilation)的 hash 信息的获取。
// 应该是当前文件hash值
return lastHash == __webpack_require__.h();
}

module.exports = function (hash, moduleMap, options) {
var reload = options.reload;
// status(): 取得模块热替换进程的当前状态; idle 该进程正在等待调用 check
if (!upToDate(hash) && module.hot.status() == 'idle') {
  if (options.log) console.log('[HMR] Checking for updates on the server...');
  check();
}

function check() {
  var cb = function (err, updatedModules) {
    if (err) return handleError(err);

    if (!updatedModules) {
      if (options.warn) {
        console.warn('[HMR] Cannot find update (Full reload needed)');
        console.warn('[HMR] (Probably because of restarting the server)');
      }
      performReload();
      return null;
    }

    var applyCallback = function (applyErr, renewedModules) {
      if (applyErr) return handleError(applyErr);

      if (!upToDate()) check();

      logUpdates(updatedModules, renewedModules);
    };

    var applyResult = module.hot.apply(applyOptions, applyCallback);
    // webpack 2 promise
    if (applyResult && applyResult.then) {
      // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
      applyResult.then(function (outdatedModules) {
        applyCallback(null, outdatedModules);
      });
      applyResult.catch(applyCallback);
    }
  };
  // module.hot.check 测试所有加载的模块以进行更新，如果有更新，则应用它们。
  var result = module.hot.check(false, cb);
  // webpack 2 promise
  if (result && result.then) {
    result.then(function (updatedModules) {
      cb(null, updatedModules);
    });
    result.catch(cb);
  }
}

function logUpdates(updatedModules, renewedModules) {
  var unacceptedModules = updatedModules.filter(function (moduleId) {
    return renewedModules && renewedModules.indexOf(moduleId) < 0;
  });

  if (unacceptedModules.length > 0) {
    if (options.warn) {
      console.warn(
        "[HMR] The following modules couldn't be hot updated: " +
          '(Full reload needed)\n' +
          'This is usually because the modules which have changed ' +
          '(and their parents) do not know how to hot reload themselves. ' +
          'See ' +
          hmrDocsUrl +
          ' for more details.'
      );
      unacceptedModules.forEach(function (moduleId) {
        console.warn('[HMR]  - ' + (moduleMap[moduleId] || moduleId));
      });
    }
    performReload();
    return;
  }

  if (options.log) {
    if (!renewedModules || renewedModules.length === 0) {
      console.log('[HMR] Nothing hot updated.');
    } else {
      console.log('[HMR] Updated modules:');
      renewedModules.forEach(function (moduleId) {
        console.log('[HMR]  - ' + (moduleMap[moduleId] || moduleId));
      });
    }

    if (upToDate()) {
      console.log('[HMR] App is up to date.');
    }
  }
}

function handleError(err) {
  if (module.hot.status() in failureStatuses) {
    if (options.warn) {
      console.warn('[HMR] Cannot check for update (Full reload needed)');
      console.warn('[HMR] ' + (err.stack || err.message));
    }
    performReload();
    return;
  }
  if (options.warn) {
    console.warn('[HMR] Update check failed: ' + (err.stack || err.message));
  }
}

function performReload() {
  if (reload) {
    if (options.warn) console.warn('[HMR] Reloading page');
    window.location.reload();
  }
}
};


/***/ }),

/***/ "./client.js":
/*!*******************!*\
!*** ./client.js ***!
\*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-env browser */
var app = document.getElementById('app');
var time = document.getElementById('time');

var timer = setInterval(updateClock, 1000);

function updateClock() {
time.innerHTML = new Date().toString();
}

// Edit these styles to see them take effect immediately
app.style.display = 'table-cell';
app.style.width = '403px';
app.style.height = '4030px';
app.style.border = '423px solid #339';
app.style.background = '#99d';
app.style.color = '#333';
app.style.textAlign = 'center';
app.style.verticalAlign = 'middle';

// Uncomment one of the following lines to see error handling
// require('unknown-module')
// } syntax-error

// Uncomment this next line to trigger a warning
// require('Assert')
__webpack_require__(/*! assert */ "./node_modules/assert/assert.js");

if (true) {
module.hot.accept();
module.hot.dispose(function () {
  clearInterval(timer);
});
}


/***/ }),

/***/ "./node_modules/assert/assert.js":
/*!***************************************!*\
!*** ./node_modules/assert/assert.js ***!
\***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var objectAssign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
* The buffer module from node.js, for the browser.
*
* @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
* @license  MIT
*/
function compare(a, b) {
if (a === b) {
  return 0;
}

var x = a.length;
var y = b.length;

for (var i = 0, len = Math.min(x, y); i < len; ++i) {
  if (a[i] !== b[i]) {
    x = a[i];
    y = b[i];
    break;
  }
}

if (x < y) {
  return -1;
}
if (y < x) {
  return 1;
}
return 0;
}
function isBuffer(b) {
if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
  return global.Buffer.isBuffer(b);
}
return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(/*! util/ */ "./node_modules/util/util.js");
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
return function foo() {}.name === 'foo';
}());
function pToString (obj) {
return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
if (isBuffer(arrbuf)) {
  return false;
}
if (typeof global.ArrayBuffer !== 'function') {
  return false;
}
if (typeof ArrayBuffer.isView === 'function') {
  return ArrayBuffer.isView(arrbuf);
}
if (!arrbuf) {
  return false;
}
if (arrbuf instanceof DataView) {
  return true;
}
if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
  return true;
}
return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
if (!util.isFunction(func)) {
  return;
}
if (functionsHaveNames) {
  return func.name;
}
var str = func.toString();
var match = str.match(regex);
return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
this.name = 'AssertionError';
this.actual = options.actual;
this.expected = options.expected;
this.operator = options.operator;
if (options.message) {
  this.message = options.message;
  this.generatedMessage = false;
} else {
  this.message = getMessage(this);
  this.generatedMessage = true;
}
var stackStartFunction = options.stackStartFunction || fail;
if (Error.captureStackTrace) {
  Error.captureStackTrace(this, stackStartFunction);
} else {
  // non v8 browsers so we can have a stacktrace
  var err = new Error();
  if (err.stack) {
    var out = err.stack;

    // try to strip useless frames
    var fn_name = getName(stackStartFunction);
    var idx = out.indexOf('\n' + fn_name);
    if (idx >= 0) {
      // once we have located the function frame
      // we need to strip out everything before it (and its line)
      var next_line = out.indexOf('\n', idx + 1);
      out = out.substring(next_line + 1);
    }

    this.stack = out;
  }
}
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
if (typeof s === 'string') {
  return s.length < n ? s : s.slice(0, n);
} else {
  return s;
}
}
function inspect(something) {
if (functionsHaveNames || !util.isFunction(something)) {
  return util.inspect(something);
}
var rawname = getName(something);
var name = rawname ? ': ' + rawname : '';
return '[Function' +  name + ']';
}
function getMessage(self) {
return truncate(inspect(self.actual), 128) + ' ' +
       self.operator + ' ' +
       truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
throw new assert.AssertionError({
  message: message,
  actual: actual,
  expected: expected,
  operator: operator,
  stackStartFunction: stackStartFunction
});
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
if (actual == expected) {
  fail(actual, expected, message, '!=', assert.notEqual);
}
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
if (!_deepEqual(actual, expected, false)) {
  fail(actual, expected, message, 'deepEqual', assert.deepEqual);
}
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
if (!_deepEqual(actual, expected, true)) {
  fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
}
};

function _deepEqual(actual, expected, strict, memos) {
// 7.1. All identical values are equivalent, as determined by ===.
if (actual === expected) {
  return true;
} else if (isBuffer(actual) && isBuffer(expected)) {
  return compare(actual, expected) === 0;

// 7.2. If the expected value is a Date object, the actual value is
// equivalent if it is also a Date object that refers to the same time.
} else if (util.isDate(actual) && util.isDate(expected)) {
  return actual.getTime() === expected.getTime();

// 7.3 If the expected value is a RegExp object, the actual value is
// equivalent if it is also a RegExp object with the same source and
// properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
} else if (util.isRegExp(actual) && util.isRegExp(expected)) {
  return actual.source === expected.source &&
         actual.global === expected.global &&
         actual.multiline === expected.multiline &&
         actual.lastIndex === expected.lastIndex &&
         actual.ignoreCase === expected.ignoreCase;

// 7.4. Other pairs that do not both pass typeof value == 'object',
// equivalence is determined by ==.
} else if ((actual === null || typeof actual !== 'object') &&
           (expected === null || typeof expected !== 'object')) {
  return strict ? actual === expected : actual == expected;

// If both values are instances of typed arrays, wrap their underlying
// ArrayBuffers in a Buffer each to increase performance
// This optimization requires the arrays to have the same type as checked by
// Object.prototype.toString (aka pToString). Never perform binary
// comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
// bit patterns are not identical.
} else if (isView(actual) && isView(expected) &&
           pToString(actual) === pToString(expected) &&
           !(actual instanceof Float32Array ||
             actual instanceof Float64Array)) {
  return compare(new Uint8Array(actual.buffer),
                 new Uint8Array(expected.buffer)) === 0;

// 7.5 For all other Object pairs, including Array objects, equivalence is
// determined by having the same number of owned properties (as verified
// with Object.prototype.hasOwnProperty.call), the same set of keys
// (although not necessarily the same order), equivalent values for every
// corresponding key, and an identical 'prototype' property. Note: this
// accounts for both named and indexed properties on Arrays.
} else if (isBuffer(actual) !== isBuffer(expected)) {
  return false;
} else {
  memos = memos || {actual: [], expected: []};

  var actualIndex = memos.actual.indexOf(actual);
  if (actualIndex !== -1) {
    if (actualIndex === memos.expected.indexOf(expected)) {
      return true;
    }
  }

  memos.actual.push(actual);
  memos.expected.push(expected);

  return objEquiv(actual, expected, strict, memos);
}
}

function isArguments(object) {
return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
if (a === null || a === undefined || b === null || b === undefined)
  return false;
// if one is a primitive, the other must be same
if (util.isPrimitive(a) || util.isPrimitive(b))
  return a === b;
if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
  return false;
var aIsArgs = isArguments(a);
var bIsArgs = isArguments(b);
if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
  return false;
if (aIsArgs) {
  a = pSlice.call(a);
  b = pSlice.call(b);
  return _deepEqual(a, b, strict);
}
var ka = objectKeys(a);
var kb = objectKeys(b);
var key, i;
// having the same number of owned properties (keys incorporates
// hasOwnProperty)
if (ka.length !== kb.length)
  return false;
//the same set of keys (although not necessarily the same order),
ka.sort();
kb.sort();
//~~~cheap key test
for (i = ka.length - 1; i >= 0; i--) {
  if (ka[i] !== kb[i])
    return false;
}
//equivalent values for every corresponding key, and
//~~~possibly expensive deep test
for (i = ka.length - 1; i >= 0; i--) {
  key = ka[i];
  if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
    return false;
}
return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
if (_deepEqual(actual, expected, false)) {
  fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
}
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
if (_deepEqual(actual, expected, true)) {
  fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
}
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
if (actual !== expected) {
  fail(actual, expected, message, '===', assert.strictEqual);
}
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
if (actual === expected) {
  fail(actual, expected, message, '!==', assert.notStrictEqual);
}
};

function expectedException(actual, expected) {
if (!actual || !expected) {
  return false;
}

if (Object.prototype.toString.call(expected) == '[object RegExp]') {
  return expected.test(actual);
}

try {
  if (actual instanceof expected) {
    return true;
  }
} catch (e) {
  // Ignore.  The instanceof check doesn't work for arrow functions.
}

if (Error.isPrototypeOf(expected)) {
  return false;
}

return expected.call({}, actual) === true;
}

function _tryBlock(block) {
var error;
try {
  block();
} catch (e) {
  error = e;
}
return error;
}

function _throws(shouldThrow, block, expected, message) {
var actual;

if (typeof block !== 'function') {
  throw new TypeError('"block" argument must be a function');
}

if (typeof expected === 'string') {
  message = expected;
  expected = null;
}

actual = _tryBlock(block);

message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
          (message ? ' ' + message : '.');

if (shouldThrow && !actual) {
  fail(actual, expected, 'Missing expected exception' + message);
}

var userProvidedMessage = typeof message === 'string';
var isUnwantedException = !shouldThrow && util.isError(actual);
var isUnexpectedException = !shouldThrow && actual && !expected;

if ((isUnwantedException &&
    userProvidedMessage &&
    expectedException(actual, expected)) ||
    isUnexpectedException) {
  fail(actual, expected, 'Got unwanted exception' + message);
}

if ((shouldThrow && actual && expected &&
    !expectedException(actual, expected)) || (!shouldThrow && actual)) {
  throw actual;
}
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
_throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
_throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

// Expose a strict only variant of assert
function strict(value, message) {
if (!value) fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
equal: assert.strictEqual,
deepEqual: assert.deepStrictEqual,
notEqual: assert.notStrictEqual,
notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
var keys = [];
for (var key in obj) {
  if (hasOwn.call(obj, key)) keys.push(key);
}
return keys;
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/inherits/inherits_browser.js":
/*!***************************************************!*\
!*** ./node_modules/inherits/inherits_browser.js ***!
\***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
// implementation from standard node.js 'util' module
module.exports = function inherits(ctor, superCtor) {
  ctor.super_ = superCtor
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};
} else {
// old school shim for old browsers
module.exports = function inherits(ctor, superCtor) {
  ctor.super_ = superCtor
  var TempCtor = function () {}
  TempCtor.prototype = superCtor.prototype
  ctor.prototype = new TempCtor()
  ctor.prototype.constructor = ctor
}
}


/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
!*** ./node_modules/object-assign/index.js ***!
\*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
      throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
      if (!Object.assign) {
          return false;
      }

      // Detect buggy property enumeration order in older V8 versions.

      // https://bugs.chromium.org/p/v8/issues/detail?id=4118
      var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
      test1[5] = 'de';
      if (Object.getOwnPropertyNames(test1)[0] === '5') {
          return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test2 = {};
      for (var i = 0; i < 10; i++) {
          test2['_' + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
          return test2[n];
      });
      if (order2.join('') !== '0123456789') {
          return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test3 = {};
      'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
          test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join('') !==
              'abcdefghijklmnopqrst') {
          return false;
      }

      return true;
  } catch (err) {
      // We don't expect any of the above to throw, but better to be safe.
      return false;
  }
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);

      for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
              to[key] = from[key];
          }
      }

      if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
              if (propIsEnumerable.call(from, symbols[i])) {
                  to[symbols[i]] = from[symbols[i]];
              }
          }
      }
  }

  return to;
};


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
!*** ./node_modules/process/browser.js ***!
\*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
  throw new Error('clearTimeout has not been defined');
}
(function () {
  try {
      if (typeof setTimeout === 'function') {
          cachedSetTimeout = setTimeout;
      } else {
          cachedSetTimeout = defaultSetTimout;
      }
  } catch (e) {
      cachedSetTimeout = defaultSetTimout;
  }
  try {
      if (typeof clearTimeout === 'function') {
          cachedClearTimeout = clearTimeout;
      } else {
          cachedClearTimeout = defaultClearTimeout;
      }
  } catch (e) {
      cachedClearTimeout = defaultClearTimeout;
  }
} ())
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
      //normal enviroments in sane situations
      return setTimeout(fun, 0);
  }
  // if setTimeout wasn't available but was latter defined
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
      cachedSetTimeout = setTimeout;
      return setTimeout(fun, 0);
  }
  try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
      return cachedSetTimeout(fun, 0);
  } catch(e){
      try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
          return cachedSetTimeout.call(null, fun, 0);
      } catch(e){
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
          return cachedSetTimeout.call(this, fun, 0);
      }
  }


}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
      //normal enviroments in sane situations
      return clearTimeout(marker);
  }
  // if clearTimeout wasn't available but was latter defined
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
      cachedClearTimeout = clearTimeout;
      return clearTimeout(marker);
  }
  try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
      return cachedClearTimeout(marker);
  } catch (e){
      try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return cachedClearTimeout.call(null, marker);
      } catch (e){
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
          // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return cachedClearTimeout.call(this, marker);
      }
  }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
      return;
  }
  draining = false;
  if (currentQueue.length) {
      queue = currentQueue.concat(queue);
  } else {
      queueIndex = -1;
  }
  if (queue.length) {
      drainQueue();
  }
}

function drainQueue() {
  if (draining) {
      return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;

  var len = queue.length;
  while(len) {
      currentQueue = queue;
      queue = [];
      while (++queueIndex < len) {
          if (currentQueue) {
              currentQueue[queueIndex].run();
          }
      }
      queueIndex = -1;
      len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
      }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
      runTimeout(drainQueue);
  }
};

// v8 likes predictible objects
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/querystring-es3/decode.js":
/*!************************************************!*\
!*** ./node_modules/querystring-es3/decode.js ***!
\************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
sep = sep || '&';
eq = eq || '=';
var obj = {};

if (typeof qs !== 'string' || qs.length === 0) {
  return obj;
}

var regexp = /\+/g;
qs = qs.split(sep);

var maxKeys = 1000;
if (options && typeof options.maxKeys === 'number') {
  maxKeys = options.maxKeys;
}

var len = qs.length;
// maxKeys <= 0 means that we should not limit keys count
if (maxKeys > 0 && len > maxKeys) {
  len = maxKeys;
}

for (var i = 0; i < len; ++i) {
  var x = qs[i].replace(regexp, '%20'),
      idx = x.indexOf(eq),
      kstr, vstr, k, v;

  if (idx >= 0) {
    kstr = x.substr(0, idx);
    vstr = x.substr(idx + 1);
  } else {
    kstr = x;
    vstr = '';
  }

  k = decodeURIComponent(kstr);
  v = decodeURIComponent(vstr);

  if (!hasOwnProperty(obj, k)) {
    obj[k] = v;
  } else if (isArray(obj[k])) {
    obj[k].push(v);
  } else {
    obj[k] = [obj[k], v];
  }
}

return obj;
};

var isArray = Array.isArray || function (xs) {
return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ "./node_modules/querystring-es3/encode.js":
/*!************************************************!*\
!*** ./node_modules/querystring-es3/encode.js ***!
\************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
switch (typeof v) {
  case 'string':
    return v;

  case 'boolean':
    return v ? 'true' : 'false';

  case 'number':
    return isFinite(v) ? v : '';

  default:
    return '';
}
};

module.exports = function(obj, sep, eq, name) {
sep = sep || '&';
eq = eq || '=';
if (obj === null) {
  obj = undefined;
}

if (typeof obj === 'object') {
  return map(objectKeys(obj), function(k) {
    var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
    if (isArray(obj[k])) {
      return map(obj[k], function(v) {
        return ks + encodeURIComponent(stringifyPrimitive(v));
      }).join(sep);
    } else {
      return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
    }
  }).join(sep);

}

if (!name) return '';
return encodeURIComponent(stringifyPrimitive(name)) + eq +
       encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
if (xs.map) return xs.map(f);
var res = [];
for (var i = 0; i < xs.length; i++) {
  res.push(f(xs[i], i));
}
return res;
}

var objectKeys = Object.keys || function (obj) {
var res = [];
for (var key in obj) {
  if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
}
return res;
};


/***/ }),

/***/ "./node_modules/querystring-es3/index.js":
/*!***********************************************!*\
!*** ./node_modules/querystring-es3/index.js ***!
\***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ "./node_modules/querystring-es3/decode.js");
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ "./node_modules/querystring-es3/encode.js");


/***/ }),

/***/ "./node_modules/util/support/isBufferBrowser.js":
/*!******************************************************!*\
!*** ./node_modules/util/support/isBufferBrowser.js ***!
\******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
return arg && typeof arg === 'object'
  && typeof arg.copy === 'function'
  && typeof arg.fill === 'function'
  && typeof arg.readUInt8 === 'function';
}

/***/ }),

/***/ "./node_modules/util/util.js":
/*!***********************************!*\
!*** ./node_modules/util/util.js ***!
\***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
function getOwnPropertyDescriptors(obj) {
  var keys = Object.keys(obj);
  var descriptors = {};
  for (var i = 0; i < keys.length; i++) {
    descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
  }
  return descriptors;
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
if (!isString(f)) {
  var objects = [];
  for (var i = 0; i < arguments.length; i++) {
    objects.push(inspect(arguments[i]));
  }
  return objects.join(' ');
}

var i = 1;
var args = arguments;
var len = args.length;
var str = String(f).replace(formatRegExp, function(x) {
  if (x === '%%') return '%';
  if (i >= len) return x;
  switch (x) {
    case '%s': return String(args[i++]);
    case '%d': return Number(args[i++]);
    case '%j':
      try {
        return JSON.stringify(args[i++]);
      } catch (_) {
        return '[Circular]';
      }
    default:
      return x;
  }
});
for (var x = args[i]; i < len; x = args[++i]) {
  if (isNull(x) || !isObject(x)) {
    str += ' ' + x;
  } else {
    str += ' ' + inspect(x);
  }
}
return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
if (typeof process !== 'undefined' && process.noDeprecation === true) {
  return fn;
}

// Allow for deprecating things in the process of starting up.
if (typeof process === 'undefined') {
  return function() {
    return exports.deprecate(fn, msg).apply(this, arguments);
  };
}

var warned = false;
function deprecated() {
  if (!warned) {
    if (process.throwDeprecation) {
      throw new Error(msg);
    } else if (process.traceDeprecation) {
      console.trace(msg);
    } else {
      console.error(msg);
    }
    warned = true;
  }
  return fn.apply(this, arguments);
}

return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
if (isUndefined(debugEnviron))
  debugEnviron = process.env.NODE_DEBUG || '';
set = set.toUpperCase();
if (!debugs[set]) {
  if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
    var pid = process.pid;
    debugs[set] = function() {
      var msg = exports.format.apply(exports, arguments);
      console.error('%s %d: %s', set, pid, msg);
    };
  } else {
    debugs[set] = function() {};
  }
}
return debugs[set];
};


/**
* Echos the value of a value. Trys to print the value out
* in the best way possible given the different types.
*
* @param {Object} obj The object to print out.
* @param {Object} opts Optional options object that alters the output.
*/
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
// default options
var ctx = {
  seen: [],
  stylize: stylizeNoColor
};
// legacy...
if (arguments.length >= 3) ctx.depth = arguments[2];
if (arguments.length >= 4) ctx.colors = arguments[3];
if (isBoolean(opts)) {
  // legacy...
  ctx.showHidden = opts;
} else if (opts) {
  // got an "options" object
  exports._extend(ctx, opts);
}
// set default options
if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
if (isUndefined(ctx.depth)) ctx.depth = 2;
if (isUndefined(ctx.colors)) ctx.colors = false;
if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
if (ctx.colors) ctx.stylize = stylizeWithColor;
return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
'bold' : [1, 22],
'italic' : [3, 23],
'underline' : [4, 24],
'inverse' : [7, 27],
'white' : [37, 39],
'grey' : [90, 39],
'black' : [30, 39],
'blue' : [34, 39],
'cyan' : [36, 39],
'green' : [32, 39],
'magenta' : [35, 39],
'red' : [31, 39],
'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
'special': 'cyan',
'number': 'yellow',
'boolean': 'yellow',
'undefined': 'grey',
'null': 'bold',
'string': 'green',
'date': 'magenta',
// "name": intentionally not styling
'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
var style = inspect.styles[styleType];

if (style) {
  return '\u001b[' + inspect.colors[style][0] + 'm' + str +
         '\u001b[' + inspect.colors[style][1] + 'm';
} else {
  return str;
}
}


function stylizeNoColor(str, styleType) {
return str;
}


function arrayToHash(array) {
var hash = {};

array.forEach(function(val, idx) {
  hash[val] = true;
});

return hash;
}


function formatValue(ctx, value, recurseTimes) {
// Provide a hook for user-specified inspect functions.
// Check that value is an object with an inspect function on it
if (ctx.customInspect &&
    value &&
    isFunction(value.inspect) &&
    // Filter out the util module, it's inspect function is special
    value.inspect !== exports.inspect &&
    // Also filter out any prototype objects using the circular check.
    !(value.constructor && value.constructor.prototype === value)) {
  var ret = value.inspect(recurseTimes, ctx);
  if (!isString(ret)) {
    ret = formatValue(ctx, ret, recurseTimes);
  }
  return ret;
}

// Primitive types cannot have properties
var primitive = formatPrimitive(ctx, value);
if (primitive) {
  return primitive;
}

// Look up the keys of the object.
var keys = Object.keys(value);
var visibleKeys = arrayToHash(keys);

if (ctx.showHidden) {
  keys = Object.getOwnPropertyNames(value);
}

// IE doesn't make error fields non-enumerable
// http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
if (isError(value)
    && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
  return formatError(value);
}

// Some type of object without properties can be shortcutted.
if (keys.length === 0) {
  if (isFunction(value)) {
    var name = value.name ? ': ' + value.name : '';
    return ctx.stylize('[Function' + name + ']', 'special');
  }
  if (isRegExp(value)) {
    return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
  }
  if (isDate(value)) {
    return ctx.stylize(Date.prototype.toString.call(value), 'date');
  }
  if (isError(value)) {
    return formatError(value);
  }
}

var base = '', array = false, braces = ['{', '}'];

// Make Array say that they are Array
if (isArray(value)) {
  array = true;
  braces = ['[', ']'];
}

// Make functions say that they are functions
if (isFunction(value)) {
  var n = value.name ? ': ' + value.name : '';
  base = ' [Function' + n + ']';
}

// Make RegExps say that they are RegExps
if (isRegExp(value)) {
  base = ' ' + RegExp.prototype.toString.call(value);
}

// Make dates with properties first say the date
if (isDate(value)) {
  base = ' ' + Date.prototype.toUTCString.call(value);
}

// Make error with message first say the error
if (isError(value)) {
  base = ' ' + formatError(value);
}

if (keys.length === 0 && (!array || value.length == 0)) {
  return braces[0] + base + braces[1];
}

if (recurseTimes < 0) {
  if (isRegExp(value)) {
    return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
  } else {
    return ctx.stylize('[Object]', 'special');
  }
}

ctx.seen.push(value);

var output;
if (array) {
  output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
} else {
  output = keys.map(function(key) {
    return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
  });
}

ctx.seen.pop();

return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
if (isUndefined(value))
  return ctx.stylize('undefined', 'undefined');
if (isString(value)) {
  var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                           .replace(/'/g, "\\'")
                                           .replace(/\\"/g, '"') + '\'';
  return ctx.stylize(simple, 'string');
}
if (isNumber(value))
  return ctx.stylize('' + value, 'number');
if (isBoolean(value))
  return ctx.stylize('' + value, 'boolean');
// For some reason typeof null is "object", so special case here.
if (isNull(value))
  return ctx.stylize('null', 'null');
}


function formatError(value) {
return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
var output = [];
for (var i = 0, l = value.length; i < l; ++i) {
  if (hasOwnProperty(value, String(i))) {
    output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
        String(i), true));
  } else {
    output.push('');
  }
}
keys.forEach(function(key) {
  if (!key.match(/^\d+$/)) {
    output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
        key, true));
  }
});
return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
var name, str, desc;
desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
if (desc.get) {
  if (desc.set) {
    str = ctx.stylize('[Getter/Setter]', 'special');
  } else {
    str = ctx.stylize('[Getter]', 'special');
  }
} else {
  if (desc.set) {
    str = ctx.stylize('[Setter]', 'special');
  }
}
if (!hasOwnProperty(visibleKeys, key)) {
  name = '[' + key + ']';
}
if (!str) {
  if (ctx.seen.indexOf(desc.value) < 0) {
    if (isNull(recurseTimes)) {
      str = formatValue(ctx, desc.value, null);
    } else {
      str = formatValue(ctx, desc.value, recurseTimes - 1);
    }
    if (str.indexOf('\n') > -1) {
      if (array) {
        str = str.split('\n').map(function(line) {
          return '  ' + line;
        }).join('\n').substr(2);
      } else {
        str = '\n' + str.split('\n').map(function(line) {
          return '   ' + line;
        }).join('\n');
      }
    }
  } else {
    str = ctx.stylize('[Circular]', 'special');
  }
}
if (isUndefined(name)) {
  if (array && key.match(/^\d+$/)) {
    return str;
  }
  name = JSON.stringify('' + key);
  if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
    name = name.substr(1, name.length - 2);
    name = ctx.stylize(name, 'name');
  } else {
    name = name.replace(/'/g, "\\'")
               .replace(/\\"/g, '"')
               .replace(/(^"|"$)/g, "'");
    name = ctx.stylize(name, 'string');
  }
}

return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
var numLinesEst = 0;
var length = output.reduce(function(prev, cur) {
  numLinesEst++;
  if (cur.indexOf('\n') >= 0) numLinesEst++;
  return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
}, 0);

if (length > 60) {
  return braces[0] +
         (base === '' ? '' : base + '\n ') +
         ' ' +
         output.join(',\n  ') +
         ' ' +
         braces[1];
}

return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
return isObject(e) &&
    (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
return arg === null ||
       typeof arg === 'boolean' ||
       typeof arg === 'number' ||
       typeof arg === 'string' ||
       typeof arg === 'symbol' ||  // ES6 symbol
       typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ "./node_modules/util/support/isBufferBrowser.js");

function objectToString(o) {
return Object.prototype.toString.call(o);
}


function pad(n) {
return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
var d = new Date();
var time = [pad(d.getHours()),
            pad(d.getMinutes()),
            pad(d.getSeconds())].join(':');
return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
* Inherit the prototype methods from one constructor into another.
*
* The Function.prototype.inherits from lang.js rewritten as a standalone
* function (not on Function.prototype). NOTE: If this file is to be loaded
* during bootstrapping this function needs to be rewritten using some native
* functions as prototype setup using normal JavaScript does not work as
* expected during bootstrapping (see mirror.js in r114903).
*
* @param {function} ctor Constructor function which needs to inherit the
*     prototype.
* @param {function} superCtor Constructor function to inherit prototype from.
*/
exports.inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");

exports._extend = function(origin, add) {
// Don't do anything if add isn't an object
if (!add || !isObject(add)) return origin;

var keys = Object.keys(add);
var i = keys.length;
while (i--) {
  origin[keys[i]] = add[keys[i]];
}
return origin;
};

function hasOwnProperty(obj, prop) {
return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
if (typeof original !== 'function')
  throw new TypeError('The "original" argument must be of type Function');

if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
  var fn = original[kCustomPromisifiedSymbol];
  if (typeof fn !== 'function') {
    throw new TypeError('The "util.promisify.custom" argument must be of type Function');
  }
  Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return fn;
}

function fn() {
  var promiseResolve, promiseReject;
  var promise = new Promise(function (resolve, reject) {
    promiseResolve = resolve;
    promiseReject = reject;
  });

  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  args.push(function (err, value) {
    if (err) {
      promiseReject(err);
    } else {
      promiseResolve(value);
    }
  });

  try {
    original.apply(this, args);
  } catch (err) {
    promiseReject(err);
  }

  return promise;
}

Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
  value: fn, enumerable: false, writable: false, configurable: true
});
return Object.defineProperties(
  fn,
  getOwnPropertyDescriptors(original)
);
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
// `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
// Because `null` is a special error value in callbacks which means "no error
// occurred", we error-wrap so the callback consumer can distinguish between
// "the promise rejected with null" or "the promise fulfilled with undefined".
if (!reason) {
  var newReason = new Error('Promise was rejected with a falsy value');
  newReason.reason = reason;
  reason = newReason;
}
return cb(reason);
}

function callbackify(original) {
if (typeof original !== 'function') {
  throw new TypeError('The "original" argument must be of type Function');
}

// We DO NOT return the promise as it gives the user a false sense that
// the promise is actually somehow related to the callback's execution
// and that the callback throwing will reject the promise.
function callbackified() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  var maybeCb = args.pop();
  if (typeof maybeCb !== 'function') {
    throw new TypeError('The last argument must be of type Function');
  }
  var self = this;
  var cb = function() {
    return maybeCb.apply(self, arguments);
  };
  // In true node style we process the callback on `nextTick` with all the
  // implications (stack, `uncaughtException`, `async_hooks`)
  original.apply(this, args)
    .then(function(ret) { process.nextTick(cb, null, ret) },
          function(rej) { process.nextTick(callbackifyOnRejected, rej, cb) });
}

Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
Object.defineProperties(callbackified,
                        getOwnPropertyDescriptors(original));
return callbackified;
}
exports.callbackify = callbackify;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
!*** (webpack)/buildin/global.js ***!
\***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
  return this;
})();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
!*** (webpack)/buildin/module.js ***!
\***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
  if (!module.webpackPolyfill) {
      module.deprecate = function() {};
      module.paths = [];
      // module.parent = undefined by default
      if (!module.children) module.children = [];
      Object.defineProperty(module, "loaded", {
          enumerable: true,
          get: function() {
              return module.l;
          }
      });
      Object.defineProperty(module, "id", {
          enumerable: true,
          get: function() {
              return module.i;
          }
      });
      module.webpackPolyfill = 1;
  }
  return module;
};


/***/ }),

/***/ 0:
/*!*****************************************************************************************!*\
!*** multi webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000 ./client.js ***!
\*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000 */"../client.js?path=/__webpack_hmr&timeout=20000");
module.exports = __webpack_require__(/*! ./client.js */"./client.js");


/***/ })

});
//# sourceMappingURL=bundle.js.map
