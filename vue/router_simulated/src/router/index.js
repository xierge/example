/*
 * @Date: 2023-05-30 16:29:13
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-30 16:42:37
 * @FilePath: /example/vue/router_simulated/src/router/index.js
 * @description:
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
// import VueRouter from '../plugin/router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
