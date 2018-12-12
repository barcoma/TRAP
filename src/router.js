import Vue from 'vue'
import Router from 'vue-router'
import MapPage from './views/MapPage.vue'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MapPage',
      component: MapPage
    },
    {
      path: '/next',
      name: 'next',
      component: Home
    },
  ]
})
