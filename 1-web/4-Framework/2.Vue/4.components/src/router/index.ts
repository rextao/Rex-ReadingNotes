import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

export const routes: Array<RouteConfig> = [
    {
        path: '/base',
        name: 'base',
        component: () => import(/* webpackChunkName: "about" */ './../pages/index.vue'),
        children: [
            {
                path: 'tooltip',
                name: 'tooltip',
                component: () => import(/* webpackChunkName: "about" */ './../pages/base/tooltip.vue'),
            },
        ]
    },
    {
        path: '/cascader',
        name: 'cascader',
        component: () => import(/* webpackChunkName: "about" */ './../pages/index.vue'),
        children: [
            {
                path: 'star',
                name: '收藏功能',
                component: () => import(/* webpackChunkName: "about" */ './../pages/cascader/category-cascader/index.vue'),
            }
        ]
    },
    {
        path: '/date-picker',
        name: 'datePicker',
        component: () => import(/* webpackChunkName: "about" */ './../pages/index.vue'),
        children: [
            {
                path: 'base',
                name: '基本功能',
                component: () => import(/* webpackChunkName: "about" */ './../pages/date-picker/base/index.vue'),
            }
        ]
    },
    {
        path: '/download',
        name: 'download',
        component: () => import(/* webpackChunkName: "about" */ './../pages/index.vue'),
        children: [
            {
                path: 'auto',
                name: 'drawer下载',
                component: () => import(/* webpackChunkName: "about" */ './../pages/download/auto-download/index.vue'),
            }
        ]
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
