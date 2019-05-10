import Vue from 'vue'
import Router from 'vue-router'
import Summaries from './views/Summaries.vue'
import Export from './views/Export.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Summaries
    },
    {
      path: '/summaries',
      name: 'Summaries',
      component: Summaries
    },
    {
      path: '/export',
      name: 'Export',
      component: Export
    },
    {
      path: '/wave',
      name: 'wave',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Wave.vue')
    }
  ]
})
