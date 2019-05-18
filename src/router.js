import Vue from 'vue'
import Router from 'vue-router'
import MapPage from './views/MapPage.vue'
import Home from './views/Home.vue'
import Team from './views/Team.vue'
import ObdPage from './views/ObdPage.vue'
import GraphQl from './components/GraphQlTest.vue'
import POIPage from './views/POIPage.vue'

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
    },
    {
      path: '/obd',
      name: 'obd',
      component: ObdPage
    },
    {
      path: '/graphql',
      name: 'graphql',
      component: GraphQl
    },
    {
      path: '/poi',
      name: 'poi',
      component: POIPage
    }
  ]
})
