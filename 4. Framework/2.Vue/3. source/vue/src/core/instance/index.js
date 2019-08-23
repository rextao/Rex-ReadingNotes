// vue class的创建，以及prototype的挂载
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// 为何使用function而不用class呢，下面的mixin会为vue混入prototype
// 用class不容易将不同是prototype分离到单独文件
function Vue (options) {
  // vue必须使用new调用，否则会报错
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 在initMixin中定义的
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
