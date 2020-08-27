# 简易的model

1. vuex较为麻烦，对于跨组件状态共享不太多的情况下，可以使用简易的版本

   ```javascript
   let _Vue = null;
   // 绑定model定义
   const allModelManagers = new Map();
   /**
    * 创建一个可自动清理的model，
    * 使用_refCount记录被组件引用的次数，在组件beforeCreate、beforeDestroy阶段更新_refCount
    *  _refCount从0到1，会用Ctr创建一个新的entity，并且尝试调用 entity.init
    *  _refCount从1到0，则销毁entity，并尝试调用 entity.destroy
    */
   
   
   class ModelManager {
       constructor(Ctr, ...args) {
           this.Ctr = Ctr;
           this.ctrArguments = args;
           this.entity = null;
           this._refCount = 0;
       }
       init() {
           if (!_Vue) {
               throw new TypeError('please install plugin first');
           }
           let entity = this.entity;
           if (entity) {
               return;
           }
           entity = new this.Ctr(...this.ctrArguments);
           /**
            * 此处调用只保证Ctr中声明的属性是响应的，
            * 如果后续在entity上增加响应式属性，需手动调用Vue.set
            */
           _Vue.util.defineReactive(this, 'entity', entity);
       }
       addRef() {
           if (this._refCount === 0) {
               this.init();
           }
           this._refCount++;
       }
       removeRef() {
           this._refCount--;
           if (this._refCount <= 0) {
               delete this.entity;
               this._refCount = 0;
           }
       }
   }
   
   function processModelsConfig(config = {}, iterate) {
       Object.entries(config).map(([key, modelDefinition]) => {
           const {modelCtr, modelCtrArguments} = normalizeModelDefinition(modelDefinition);
           if (allModelManagers.has(modelCtr)) {
               return iterate(allModelManagers.get(modelCtr), key);
           }
           const modelManager = new ModelManager(modelCtr, ...modelCtrArguments);
           allModelManagers.set(modelCtr, modelManager);
           return iterate(modelManager, key);
       });
   }
   
   // 支持两种model定义，class和数组（第一个元素为class）
   function normalizeModelDefinition(modelDefinition) {
       if (typeof modelDefinition === 'function') {
           return {
               modelCtr: modelDefinition,
               modelCtrArguments: []
           };
       }
       if (Array.isArray(modelDefinition) && typeof modelDefinition[0] === 'function') {
           return {
               modelCtr: modelDefinition[0],
               modelCtrArguments: modelDefinition.slice(1)
           }
       }
       throw new Error('invalid model definition');
   }
   
   const plugin = {
       install(Vue) {
           if (_Vue && _Vue === Vue) {
               return;
           }
           _Vue = Vue;
           Vue.mixin({
               beforeCreate() {
                   const models = {};
                   // 使用回调方式，方便add和remove
                   processModelsConfig(this.$options.models, (modelManager, key) => {
                       modelManager.addRef();
                       models[key] = modelManager.entity;
                   });
                   // 主要是将model数据绑定到data上，可以通过vue-tools查看
                   const data = typeof this.$options.data === 'function' ?  this.$options.data : () => data || {};
                   this.$options.data = function () {
                       const result = data.call(this);
                       return {
                           ...result,
                           ...models
                       }
                   };
               },
               beforeDestroy() {
                   processModelsConfig(this.$options.models, (modelManager) => {
                       modelManager.removeRef();
                   });
               }
           });
       }
   };
   
   
   export default {
       plugin
   }
   ```

   - 在main.js中直接使用

     ```javascript
     import vueModel  from './../model/rexModel';
     const { plugin } = vueModel;
     Vue.use(plugin);
     ```

2. 思路

   - 在`beforeCreate`中获取`$options.models`的值（一般是引入的一个Class）
   - 如果在缓存中找到此model的实例，则直接使用，否则new一个
   - 进入时，调用实例addRef方法，如果此实例已经初始化，则计数+1，否则init，设置model的实例为响应式
   - 然后将model实例绑定到data上

   