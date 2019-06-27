import Vue from 'vue'
import Router from 'vue-router'
import MapPage from './views/MapPage.vue'
import Home from './views/Home.vue'
import ObdPage from './views/ObdPage.vue'
import GraphQl from './components/GraphQlTest.vue'
import Settings from './views/Settings.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/map',
      name: 'MapPage',
      component: MapPage
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/obd',
      name: 'OBD',
      component: ObdPage
    },
    {
      path: '/graphql',
      name: 'graphql',
      component: GraphQl
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})
