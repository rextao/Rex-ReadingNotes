/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'
import {callHook} from "../instance/lifecycle";

let uid = 0  // Dep实例的id，为了方便去重

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * 主要是建立数据与watcher之间的桥梁，可以理解为依赖收集器，记录了哪些Watcher依赖自己的变化
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = [] // 观察者集合，所有的watcher
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  // 依赖收集，当存在Dep.target的时候把自己添加观察者的依赖中
  depend () {
    // Dep.target实际是一个watcher
    if (Dep.target) {
      // 调用的是watcher的addDep方法
      Dep.target.addDep(this)
    }
  }

  // 通知所有观察者
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// 为何会有pushTarget与popTarget，主要是为了处理嵌套组件的问题
Dep.target = null
const targetStack = []
// 注意callHook会调用此函数，但调用完会调用popTarget返回targetStack值
export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
