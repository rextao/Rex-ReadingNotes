import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../view/home/index.vue';

Vue.use(VueRouter);

export default function createRouter() {
  return new VueRouter({
    mode: 'history',
    base: '/admin/',
    routes: [
      {
        path: '/',
        component: Home
      },
    ]
  });
}
