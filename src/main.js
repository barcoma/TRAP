import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import mapboxgl from 'mapbox-gl'
import VueRouter from 'vue-router'
import router from './router'


import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '../node_modules/material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(VueRouter)
Vue.use(Vuetify)



mapboxgl.accesToken = 'pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjam9xM3gwYWYwMHlpM3ZrZmY4NWNwam9kIn0.TE3Zma1nEd5mbbdVCfQGMA';

Vue.config.productionTip = false;

export const eventBus = new Vue();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
