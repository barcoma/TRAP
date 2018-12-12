import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import mapboxgl from 'mapbox-gl'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy);


mapboxgl.accesToken = 'pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjam9xM3gwYWYwMHlpM3ZrZmY4NWNwam9kIn0.TE3Zma1nEd5mbbdVCfQGMA';

Vue.config.productionTip = false;

export const eventBus = new Vue();

new Vue({
  render: h => h(App)
}).$mount('#app')
