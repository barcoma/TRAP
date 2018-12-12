<template>
  <div id="app">
    <section class="main-content">
      <MapBox 
      ref="MapBox"
      class="main-map"
      />
      <map-nav id="map-navigation"></map-nav>
    </section>
    <section class="tab-nav">
      <tab-nav></tab-nav>
    </section>
  </div>
</template>

<script>
import MapBox from './components/MapBox.vue'
import MapNav from './components/MapNav.vue'
import TabNav from './components/TabNav.vue'
import mapboxgl from 'mapbox-gl'




export default {
  name: 'app',
  components: {
    MapBox,
    MapNav,
    TabNav
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

.main-content{
  height: 90%;
}

.tab-nav{
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
}

#map-navigation{
  z-index: 10;
}
</style>
