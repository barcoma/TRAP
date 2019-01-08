<template>
  <div id="app">
    <MapBox 
    ref="MapBox"
    msg="Welcome to Your Vue.js App"
    class="main-map"
    />
    <map-nav id="map-navigation"></map-nav>
    <button v-on:click="removeGeocode">Remove</button>
    <o-b-d></o-b-d>
  </div>
</template>


<script>
import MapBox from './components/MapBox.vue'
import MapNav from './components/MapNav.vue'
import TabNav from './components/TabNav.vue'
import OBD from './components/OBD.vue'
import mapboxgl from 'mapbox-gl'




export default {
  name: 'app',
  components: {
    MapBox,
    MapNav,
    TabNav,
    OBD
  },
  methods: {
    removeGeocode: function(){
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

.app-content{
  height: 90%;
}

.app-nav{
  height: 10%;
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
  height: 100vh;
  overflow: hidden;
}

#map-navigation{
  z-index: 10;
}
</style>
