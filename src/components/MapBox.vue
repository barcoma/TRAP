<template>
<div class="wrapper">
  <div id="map" ref="map">
  </div>
  <h6>Long: {{long}} Lat:{{lat}}</h6>
  <input v-model="newlong" placeholder="long">
  <input v-model="newlat" placeholder="lat">
  <button v-on:click="refresh(newlong, newlat)">Remove</button>
</div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from 'mapbox-gl-geocoder'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'


export default {
  name: 'MapBox',
  data() {
    return {
      newlong:'',
      newlat:'',
      lat: Number,
      long: Number,
      mainMap: Object,
      marker: Object,
      geocoder: Object,
      directions: Object
    }
  },
  methods: {
    refresh: function(newlong, newlat){
      this.long = newlong;
      this.lat = newlat;
      this.marker.setLngLat([this.long, this.lat])
      this.mainMap.easeTo({
        duration: 3000,
        ease: 0.2,
        animate: true,
        center: [this.long, this.lat],
        zoom: 8,
        bearing: 0
      })
    },
    updateMarker: function(e){
      var newCenter = e.result.center;
      this.marker.setLngLat([newCenter[0],newCenter[1]]);
      this.long = newCenter[0];
      this.lat = newCenter[1];
      },
      remove: function(){
      this.mainMap.removeControl(this.geocoder);
    }
  },
  mounted(){
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjam9xM3gwYWYwMHlpM3ZrZmY4NWNwam9kIn0.TE3Zma1nEd5mbbdVCfQGMA';
  this.lat = 48.050094;
  this.long = 8.201717;

  this.mainMap = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [this.long, this.lat],
        zoom: 8
    });
         
  this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken
    });

  this.directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken
    }, 'bottom-left');

  this.mainMap
    .addControl(this.geocoder, 'top-right')
    .addControl(this.directions, 'bottom-left')

  this.marker = new mapboxgl.Marker({
    color: '#EE0000',
    draggable: false
  })
    .setLngLat([this.long, this.lat])
    .addTo(this.mainMap);

  this.geocoder.on('result', this.updateMarker);
  }
}


</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

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
