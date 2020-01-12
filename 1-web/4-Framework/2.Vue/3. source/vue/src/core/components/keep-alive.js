/* @flow */

import { isRegExp, remove } from 'shared/util'
import { getFirstComponentChild } from 'core/vdom/helpers/index'

type VNodeCache = { [key: string]: ?VNode };

function getComponentName (opts: ?VNodeComponentOptions): ?string {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  // 遍历缓存
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      // 新name不满足filter，则删除
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  // 如果要删除的组件tag并不是当前渲染tag，则调用$destroy，销毁组件
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

const patternTypes: Array<Function> = [String, RegExp, Array]

export default {
  name: 'keep-alive',
  // 一个抽象组件
  // src/core/instance/lifecycle.js
  // abstract来处理：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。
  abstract: true,

  props: {
    include: patternTypes, // 只有名称匹配的组件会被缓存
    exclude: patternTypes, // 任何名称匹配的组件都不会被缓存。
    max: [String, Number] // 缓存最大数量
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    // 对include与exclude进行watch
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
  // 1、获取第一个子元素，2、处理include与exclude，3、处理是否使用缓存，vnode.componentInstance
  // 4、处理max参数
  render () {
    const slot = this.$slots.default
    // src/core/vdom/helpers/get-first-component-child.js
    // 注意：组件只处理第一个子元素，故一般和component 动态组件或者是 router-view
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      // 获取组件名
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      // 不需要缓存的，直接返回vnode
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      // 获取要缓存的key
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        // remove: Remove an item from an array.
        // 重新调整了 key 的顺序放在了最后一个
        // 利用keys数组实现缓存策略，这样能保证最新使用的都在后面，最前面的一定是最不长用的
        // 使用LRU算法，选择最近最久未使用的页面予以淘汰。
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        // 如果超过最大缓存数量，则从缓存中删除第一个
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
