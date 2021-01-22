import Vue from 'vue'
import App from './App.vue'//这里一定要写上.vue,不然会匹配到app.js,require不区分大小写0.0
export default function(){
    return new Vue({
        render:h => h(App)
    })
}
