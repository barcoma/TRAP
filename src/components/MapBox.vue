<template>
<div class="wrapper">
  <!-- <div ref="custom-marker" class="custom-marker"></div> -->
  <div id="map" ref="map">
  </div>
  <button class="Btn-gps" v-on:click="showPos()">GPS</button>
  <h6>Long: {{long}} Lat:{{lat}}</h6>
  <input v-model="newlong" placeholder="long">
  <input v-model="newlat" placeholder="lat">
  <button v-on:click="refresh(newlong, newlat)">showPos</button>
</div>
</template>

<script>
import MapNav from './MapNav.vue'
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
      mainMapp: Object,
      marker: Object,
      geocoder: Object,
      directions: Object,
      aktPos: [],
      gpsOptions: Object
    }
  },
  methods: {
    refresh: function(newlong, newlat){
      this.long = newlong;
      this.lat = newlat;
      this.marker.setLngLat([this.long, this.lat])
      this.mainMapp.easeTo({
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
      this.mainMapp.removeControl(this.directions);
    },
    showPosition: function(position){
      this.aktPos = [position.coords.longitude, position.coords.latitude];
      return this.aktPos;
    },
    showPos: function(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.gpsSuccess, this.gpsError, this.gpsOptions);
      };
      if(this.aktPos.length > 1){

      this.long = this.aktPos[0];
      this.lat = this.aktPos[1];
      
      this.mainMapp.easeTo({
        duration: 3000,
        ease: 0.2,
        animate: true,
        center: this.aktPos,
        zoom: 12,
        bearing: 0
      });
      this.marker.setLngLat(this.aktPos);
      
      }
    },
    gpsSuccess: function(position){
      this.aktPos = [position.coords.longitude, position.coords.latitude];

      return this.aktPos;
    },
    gpsError: function(){
      console.log('ERROR GPS')
    }
  },
  created(){
    eventBus.$on('toggleDirections', (isVisible) =>{
      if(isVisible == true){
        this.mainMapp.addControl(this.directions, 'bottom-left');
      } else {
        this.mainMapp.removeControl(this.directions);
      } 
      });
  },
  mounted(){
  
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjam9xM3gwYWYwMHlpM3ZrZmY4NWNwam9kIn0.TE3Zma1nEd5mbbdVCfQGMA';
  this. lat = 48.218800;
  this.long = 11.624707;

  this.mainMapp = new mapboxgl.Map({
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
    }
    , 'bottom-left');


  this.mainMapp
    .addControl(this.geocoder, 'top-right')
    // .addControl(this.directions, 'bottom-left')


  this.marker = new mapboxgl.Marker({
    // element: this.$refs.custom-marker,     WENN CUSTOM MARKER EINGEFÜGT IST
    draggable: false
  })
    .setLngLat([this.long, this.lat])
    .addTo(this.mainMapp);

  this.geocoder.on('result', this.updateMarker);

  this.gpsOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

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

.Btn-gps{
  position: relative;
  top: -12vh;
  left: 45vw;
  height: 3vw;
  width: 3vw;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  font-weight: 900;
  border-radius: 15px;
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

@media only screen and (max-width: 599px) {
  
.Btn-gps{
  position: relative;
  top: -12vh;
  left: 35vw;
  height: 15vw;
  width: 17vw;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  font-weight: 900;
  border-radius: 15px;
}

}



</style>
