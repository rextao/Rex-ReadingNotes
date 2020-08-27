const target = typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
    ? global
    : {}
// 如果我们浏览器装了 Vue 开发者工具，那么在 window 上就会有一个 __VUE_DEVTOOLS_GLOBAL_HOOK__ 的引用
const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__

export default function devtoolPlugin (store) {
  if (!devtoolHook) return

  store._devtoolHook = devtoolHook

  devtoolHook.emit('vuex:init', store)
  // 监听 Vuex 的 traval-to-state 的事件，把当前的状态树替换成目标状态树
  devtoolHook.on('vuex:travel-to-state', targetState => {
    store.replaceState(targetState)
  })

  store.subscribe((mutation, state) => {
    devtoolHook.emit('vuex:mutation', mutation, state)
  })
}
