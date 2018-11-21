<template>
<div class="wrapper">
  <div id="map" ref="map"></div>
  <input v-model="newlong" placeholder="long">
  <input v-model="newlat" placeholder="lat">
  <button v-on:click="refresh(newlong, newlat)">Refresh</button>
</div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from 'mapbox-gl-geocoder'

export default {
  name: 'MapBox',
  data() {
    return {
      lat: Number,
      long: Number,
      mainMapp: Object
    }
  },
  methods: {
    refresh: function(newlong, newlat){
      console.log('refresh', newlong)
      this.long = newlong;
      this.lat = newlat;
      this.mainMapp.easeTo({
        duration: 3000,
        ease: 0.2,
        animate: true,
        center: [this.long, this.lat],
        zoom: 4,
        bearing: 0
      })
    }
  },
  mounted(){
  mapboxgl.accesToken = 'pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjam9xM3gwYWYwMHlpM3ZrZmY4NWNwam9kIn0.TE3Zma1nEd5mbbdVCfQGMA';
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjam9xM3gwYWYwMHlpM3ZrZmY4NWNwam9kIn0.TE3Zma1nEd5mbbdVCfQGMA';
  this. lat = 48.050094;
  this.long = 8.201717;
  this.mainMapp = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [this.long, this.lat],
        zoom: 4
    }).addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken
    }));; 

  
  }
}


</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '/Users/marcobalzer/Desktop/MapBox/hello-world/node_modules/mapbox-gl/dist/mapbox-gl.css';

.wrapper{
  width: 100vw;
}


#map {
	width: 100%;
	height: 600px;
  background-color: rgba(255, 0, 0, 0.1);
  position: relative;
}
</style>
