/* @flow */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.
// FLIP是 First、Last、Invert和 Play四个单词首字母的缩写

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.
// 由于虚拟 DOM 的子元素更新算法是不稳定的，它不能保证被移除元素的相对位置，
// 所以强制 <transition-group> 组件更新子节点通过 2 个步骤：
// 第一步我们移除需要移除的 vnode，同时触发它们的 leaving 过渡；
// 第二步我们需要把插入和移动的节点达到它们的最终态，同时还要保证移除的节点保留在应该的位置，
// 而这个是通过 beforeMount 钩子函数来实现的：

import { warn, extend } from 'core/util/index'
import { addClass, removeClass } from '../class-util'
import { transitionProps, extractTransitionData } from './transition'
import { setActiveInstance } from 'core/instance/lifecycle'

import {
  hasTransition,
  getTransitionInfo,
  transitionEndEvent,
  addTransitionClass,
  removeTransitionClass
} from '../transition-util'
// transition-group多了tag和moveClass两个props，其他的在transition使用的
// 都可以使用
const props = extend({
  tag: String,
  moveClass: String
}, transitionProps)

delete props.mode

export default {
  props,

  beforeMount () {
    // 此_update方法实际是Vue.prototype._update
    const update = this._update
    this._update = (vnode, hydrating) => {
      const restoreActiveInstance = setActiveInstance(this)
      // force removing pass
      // this.__patch__ 对应的是 src/core/vdom/patch.js 返回 的return函数
      // 由于第4个参数为true，故在patchVnode时，不会移动元素
      this.__patch__(
        this._vnode, // 就是当前vue的vnode
        this.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      )
      this._vnode = this.kept
      restoreActiveInstance()
      update.call(this, vnode, hydrating)
    }
  },
  // 注意：组件不是抽象组件，会渲染一个真实节点
  // 这h函数是createElement
  render (h: Function) {
    const tag: string = this.tag || this.$vnode.data.tag || 'span'
    const map: Object = Object.create(null)
    const prevChildren: Array<VNode> = this.prevChildren = this.children
    const rawChildren: Array<VNode> = this.$slots.default || [] // 原始子节点
    const children: Array<VNode> = this.children = []
    const transitionData: Object = extractTransitionData(this)
    // 1、循环子节点，配置c.data.transition, c.key，可以看出children必须有key属性
    // 每个子元素具有data.transition属性，会进入transition.js 的enter函数（src/platforms/web/runtime/modules/transition.js）
    for (let i = 0; i < rawChildren.length; i++) {
      const c: VNode = rawChildren[i]
      if (c.tag) {
        // 利用v-for指令，会执行render-list : src/core/instance/render-helpers/render-list.js
        // 最终会添加_isVList 标志，然后在normalizeArrayChildren： src/core/vdom/helpers/normalize-children.js
        // 会对_istVList进行转换， 将key转换为`__vlist${nestedIndex}_${i}__`
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          // 同时数据会绑定到this.children中
          children.push(c)
          map[c.key] = c
          // 动画根本原因，会将每个节点增加transitionData
          // 只有这样才能实现列表中单个元素的过渡动画。
          ;(c.data || (c.data = {})).transition = transitionData
        } else if (process.env.NODE_ENV !== 'production') {
          const opts: ?VNodeComponentOptions = c.componentOptions
          const name: string = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag
          warn(`<transition-group> children must be keyed: <${name}>`)
        }
      }
    }
    // 2、如果存在prevChildren，获取元素位置，获取被删除元素
    // 也是最开始说的，动画分两步中的第一步
    // 主要是处理对改变元素产生移动动画的效果
    if (prevChildren) {
      const kept: Array<VNode> = []
      const removed: Array<VNode> = []
      for (let i = 0; i < prevChildren.length; i++) {
        const c: VNode = prevChildren[i]
        c.data.transition = transitionData
        // 运动动画的关键
        c.data.pos = c.elm.getBoundingClientRect()
        if (map[c.key]) {
          kept.push(c)
        } else {
          removed.push(c)
        }
      }
      // 利用createElement计算prevChildren的vnode
      this.kept = h(tag, null, kept)
      this.removed = removed
    }
    // 最终createElement，在create钩子函数会调用子组件的动画效果
    // 由于patchVnode，只会创建新节点vnode，故只会触发一次enter
    return h(tag, null, children)
  },

  // 如果没有updated钩子，不会产生右移动效果，可在updated直接return看到效果
  // 主要是处理.list-complete-move {
  //   transition: all 1s;
  // }
  updated () {
    const children: Array<VNode> = this.prevChildren
    const moveClass: string = this.moveClass || ((this.name || 'v') + '-move')
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    // c.elm._moveCb()与c.elm._enterCb()
    children.forEach(callPendingCbs)
    // 记录新位置
    children.forEach(recordPosition)
    // 如果有移动，c.data.moved = true，且设置s.transform
    children.forEach(applyTranslation)

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    // 强制重绘，方便计算新位置
    this._reflow = document.body.offsetHeight
    // 实现子元素的过渡，主要是增加move的class
    children.forEach((c: VNode) => {
      if (c.data.moved) {
        const el: any = c.elm
        const s: any = el.style
        addTransitionClass(el, moveClass)
        // children.forEach(applyTranslation)中设置了transform回到prev位置
        // 此处设置"" ，会触发transition
        s.transform = s.WebkitTransform = s.transitionDuration = ''
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (e && e.target !== el) {
            return
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb)
            el._moveCb = null
            removeTransitionClass(el, moveClass)
          }
        })
      }
    })
  },

  methods: {
    hasMove (el: any, moveClass: string): boolean {
      /* istanbul ignore if */
      // 支持transition ： inBrowser && !isIE9
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      const clone: HTMLElement = el.cloneNode()
      // 在src/platforms/web/runtime/modules/transition.js
      // 会调用addTransitionClass，往_transitionClasses添加class
      if (el._transitionClasses) {
        el._transitionClasses.forEach((cls: string) => { removeClass(clone, cls) })
      }
      addClass(clone, moveClass)
      clone.style.display = 'none'
      this.$el.appendChild(clone)
      // 获取缓动相关信息
      const info: Object = getTransitionInfo(clone)
      this.$el.removeChild(clone)
      return (this._hasMove = info.hasTransform)
    }
  }
}

function callPendingCbs (c: VNode) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb()
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb()
  }
}

function recordPosition (c: VNode) {
  c.data.newPos = c.elm.getBoundingClientRect()
}

function applyTranslation (c: VNode) {
  const oldPos = c.data.pos
  const newPos = c.data.newPos
  const dx = oldPos.left - newPos.left
  const dy = oldPos.top - newPos.top
  if (dx || dy) {
    c.data.moved = true
    const s = c.elm.style
    // 对于有挪动的元素，先将元素挪动为之前位置
    s.transform = s.WebkitTransform = `translate(${dx}px,${dy}px)`
    s.transitionDuration = '0s'
  }
}
