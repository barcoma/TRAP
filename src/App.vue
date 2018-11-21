<template>
  <div id="app">
    <h1>Map</h1>
    <MapBox 
    msg="Welcome to Your Vue.js App"
    />
  </div>
</template>

<script>
import MapBox from './components/MapBox.vue'
import mapboxgl from 'mapbox-gl'

mapboxgl.accesToken = 'pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjam9xM3gwYWYwMHlpM3ZrZmY4NWNwam9kIn0.TE3Zma1nEd5mbbdVCfQGMA';

export default {
  name: 'app',
  components: {
    MapBox
  }
}

</script>

<style lang="scss">

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
  margin-top: 60px;
}
</style>
