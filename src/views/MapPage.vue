<template>
    <section class="mappage-main-content">
      <MapBox 
      ref="MapBox"
      class="main-map"
      />
      <!-- <map-nav id="map-navigation"></map-nav> -->
      <!-- <sidebarmenu class="sidebarmenu"/> -->
    </section>
</template>

<script>
import MapBox from '../components/MapBox.vue'
import TabNav from '../components/TabNav.vue'
import mapboxgl from 'mapbox-gl'




export default {
  name: 'MapPage',
  components: {
    MapBox,
    TabNav,
    Sidebarmenu
  },
  methods: {
    removeGeocode: function(){
      this.$refs.MapBox.remove();
    }
  }
}

</script>

<style scoped lang="scss">

button:focus{
  border: none !important;
}

body{
  margin: 0;
}

.mappage-main-content{
  height: 100%;
}


.mapboxgl-canvas-container{
  canvas{
    position: relative !important;
  }
}


#map-navigation{
  z-index: 10;
}
</style>
