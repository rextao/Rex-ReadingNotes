import Vue from 'vue'
import App from './../../generator-result/table/index';
import KsElementUI from '@ks/ks-element-ui';
import '@ks/ks-element-ui/lib/theme-data/index.css';
Vue.use(KsElementUI);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
