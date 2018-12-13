import Vue from 'vue'
import Router from 'vue-router'
import MapPage from './views/MapPage.vue'
import Home from './views/Home.vue'
import Team from './views/Team.vue'

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
      path: '/team',
      name: 'team',
      component: Team
    }
  ]
})
