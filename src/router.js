import Vue from 'vue'
import Router from 'vue-router'
import MapPage from './views/MapPage.vue'
import Home from './views/Home.vue'
import ObdPage from './views/ObdPage.vue'
import GraphQl from './components/GraphQlTest.vue'
import POIPage from './views/POIPage.vue'
import lastdest from './views/lastdest.vue'
import createPoiPage from './views/createPoiPage.vue'
import welcome from './views/Welcome.vue'

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
    },
    {
      path: '/lastdest',
      name: 'lastdest',
      component: lastdest
    },
    {
      path: '/createPoi',
      name: 'createPoi',
      component: createPoiPage
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: welcome
    }
  ]
})
