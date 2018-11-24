<template>
  <div id="app">
    <MapBox 
    ref="MapBox"
    msg="Welcome to Your Vue.js App"
    class="main-map"
    />
    <map-nav id="map-navigation"></map-nav>
    <button v-on:click="removeGeocode">Remove</button>
    
  </div>
</template>

<script>
import MapBox from './components/MapBox.vue'
import MapNav from './components/MapNav.vue'
import mapboxgl from 'mapbox-gl'

export default {
  name: 'app',
  components: {
    MapBox,
    MapNav
  },
  methods: {
    removeGeocode: function(){
      console.log('hey');
      this.$refs.MapBox.remove();
    }
  }
}

</script>

<style lang="scss">

button:focus{
  border: none !important;
}

body{
  margin: 0;
}

.mapboxgl-ctrl-geocoder input[type='text']{

}  

.mapboxgl-canvas-container{
  canvas{
    position: relative !important;
  }
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

#map-navigation{
  z-index: 10;
}
</style>
