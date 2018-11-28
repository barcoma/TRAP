<template>
<div class="wrapper">
  <!-- <div ref="custom-marker" class="custom-marker"></div> -->
  <div id="map" ref="map">
  </div>
  <h6>Long: {{long}} Lat:{{lat}}</h6>
  <input v-model="newlong" placeholder="long">
  <input v-model="newlat" placeholder="lat">
</div>
</template>

<script>
import MapNav from './MapNav.vue';
import {eventBus} from '../main.js';


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
      directions: Object,
      aktPos: [],
      userLocation: Object
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
      this.mainMap.removeControl(this.directions);
    }
  },
  created(){
    eventBus.$on('toggleDirections', (isVisible) =>{
      if(isVisible == true){
        this.mainMap.addControl(this.directions, 'bottom-left');
      } else {
        this.mainMap.removeControl(this.directions);
      } 
      });
  },
  mounted(){
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjam9xM3gwYWYwMHlpM3ZrZmY4NWNwam9kIn0.TE3Zma1nEd5mbbdVCfQGMA';
  this. lat = 48.218800;
  this.long = 11.624707;

  this.mainMap = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [this.long, this.lat],
        zoom: 9
    });
         
  this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken
    });

  this.directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken
    }, 'bottom-left');

  this.userLocation = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  });

  this.mainMap
    .addControl(this.geocoder, 'top-right')
    .addControl(this.userLocation, 'bottom-right')
    // .addControl(this.directions, 'bottom-left')

  this.marker = new mapboxgl.Marker({
    // element: this.$refs.custom-marker,     WENN CUSTOM MARKER EINGEFÜGT IST
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
  height: 100vh;
  position: relative;
}

//custom-marker
.custom-marker {
  background-image: url('');
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}

.geocoder {
    position:absolute;
    z-index:1;
    width:50%;
    left:50%;
    margin-left:-25%;
    top:20px;
}

.mapboxgl-ctrl-geocoder { 
    min-width:100%; 
}

@media only screen and (max-width: 599px) {
  
}



</style>
