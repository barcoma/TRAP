<template>
  <div id="app">
    <MapBox 
    msg="Welcome to Your Vue.js App"
    />
  </div>
</template>

<script>
import MapBox from './components/MapBox.vue'
import mapboxgl from 'mapbox-gl'


export default {
  name: 'app',
  components: {
    MapBox
  }
}

</script>

<style lang="scss">

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
</style>
