// Credits: borrowed code from fcomb/redux-logger

import { deepCopy } from '../util'
// 可以实时把 mutation 的动作以及 store 的 state 的变化实时输出
export default function createLogger ({
  collapsed = true,
  filter = (mutation, stateBefore, stateAfter) => true,
  transformer = state => state,
  mutationTransformer = mut => mut,
  logger = console
} = {}) {
  return store => {
    // 1. 拷贝state对象，旧状态
    let prevState = deepCopy(store.state)
    // 1. store.subscribe(() => {}) 一个函数
    // 相当于订阅state的变化，当state变化就会执行此函数
    store.subscribe((mutation, state) => {
      // 1. logger如果未定义，则直接返回
      if (typeof logger === 'undefined') {
        return
      }
      // 1. 拷贝新状态
      const nextState = deepCopy(state)
      // 1. 可以自定义一个filter函数，即，有些mutation或prevState不想被打印
      if (filter(mutation, prevState, nextState)) {
        const time = new Date()
        // 获取时间戳
        const formattedTime = ` @ ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`
        const formattedMutation = mutationTransformer(mutation)
        const message = `mutation ${mutation.type}${formattedTime}`
        const startMessage = collapsed
          ? logger.groupCollapsed
          : logger.group

        // render
        try {
          startMessage.call(logger, message)
        } catch (e) {
          console.log(message)
        }

        logger.log('%c prev state', 'color: #9E9E9E; font-weight: bold', transformer(prevState))
        logger.log('%c mutation', 'color: #03A9F4; font-weight: bold', formattedMutation)
        logger.log('%c next state', 'color: #4CAF50; font-weight: bold', transformer(nextState))

        try {
          logger.groupEnd()
        } catch (e) {
          logger.log('—— log end ——')
        }
      }

      prevState = nextState
    })
  }
}

function repeat (str, times) {
  return (new Array(times + 1)).join(str)
}

function pad (num, maxLength) {
  return repeat('0', maxLength - num.toString().length) + num
}
