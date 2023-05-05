/* @flow */

import Dep from './dep'
import VNode from '../vdom/vnode'
import { arrayMethods } from './array'
import {
  def,
  warn,
  hasOwn,
  hasProto,
  isObject,
  isPlainObject,
  isPrimitive,
  isUndef,
  isValidArrayIndex,
  isServerRendering
} from '../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export let shouldObserve: boolean = true
// 通过toggleObserving切换shouldObserve
export function toggleObserving (value: boolean) {
  shouldObserve = value
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 * 相当于一个观察者
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

   constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    // 利用def定义__ob__，由于第四个参数为undefined，为了避免为此属性增加observe
    def(value, '__ob__', this)
    // 如果是array，则递归调用observe进行观察
    if (Array.isArray(value)) {
      if (hasProto) {
        // 如存在__proto__，现在大部分浏览器都可以使用__proto__
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      // 循环遍历数组元素，递归观察元素
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 如当前值存在__Ob__，且不是Observer实例，则返回缓存的这个值
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    // 全局定义的一个值
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  // 根数据vmCount为非0
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 * 定义对象一个可响应属性，实际就是将对象的某个属性变为响应式
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // dep是一个纽带，连接watcher和数据
  // 这个是针对某个值的观察者序列
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  // 当某个对象是值是一个对象时，递归调用observe
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // get主要是做依赖收集的事情，解决数据改变的时候，如何让使用到数据的地方也改变
    // 何时会调用呢？src/core/instance/lifecycle.js中，在mountComponent时会new Watcher
    // 最终会调用render，会调用这些对象的get方法
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      // Dep.target可以暂时理解为某个使用此数据的一个watcher，依赖收集就是要收集这个watcher
      if (Dep.target) {
        dep.depend()
        // 为Vue.set 量身定制的。。首先为对象添加属性，是无法触发getter的
        // 如下数据结构 data () {
        //    return {
        //      msg: {a: 1}
        //    }
        // }
        // Observe过后，会形成
        //            { __ob__: {dep.id: 5}
        //              msg: {
        //                a: 1,
        //                __ob__: {dep.id: 7}
        //              }
        //            }
        // 实际上对于访问msg.a 在defineReactive中，会为a定义一个dep，依赖收集时，会收集到
        // 而vue，为了避免手动为msg添加属性，而无法自动触发getter
        // vue利用如下方式，将wather，加入到dep.id:7中。实际childOb就是dep.id:7这个
        // 有种这个__ob__实际是一个存储当前对象watcher的，然后Vue.set手动触发这个dep.notify
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    // 主要是要做派发更新的事情，改变数据就会触发set方法
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 如果新是对象，则也会变为响应式的
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 * Vue.set本质就是内部调用手动ob.dep.notify()，通过手动调用解决不能触发setter的问题（如数组push等）
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  // 在开发模式下，对undefined和基本类型，使用Vue.set报warning
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    // 为何调用splice，就能进行重新渲染了呢？因为Observe的constructor对array做了特别处理
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  // 如果一个对象是响应式的，则对象具有__ob__这个属性
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  // 对象最终是调用notify进行重新渲染
  ob.dep.notify()
  return val
}

/**
 * Delete a property and trigger change if necessary.
 * 删除对象的属性。如果对象是响应式的，确保删除能触发更新视图
 * 避开vue无法检测的情况，应该很少使用
 */
export function del (target: Array<any> | Object, key: any) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 * 在访问数组时收集对数组元素的依赖关系，因为我们不能像属性getter那样拦截数组元素访问。
 */
function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
