<template>
<div class="wrapper">
  <!-- <div ref="custom-marker" class="custom-marker"></div> -->
  <div id="map" ref="map">
    <input type="text" v-on:change="searchPOI($event)"  placeholder="Discover.."/>
  </div>
</div>
</template>

<script>
import MapNav from './MapNav.vue';
import {eventBus} from '../main.js';
import gql from 'graphql-tag';

import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from 'mapbox-gl-geocoder'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'

var markers = [];

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
      userLocation: Object,
      foursquareResponse: Object,
      foursquareSearch: String,
      searchTerm: String
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
    searchPOI: function(event) {
      this.clearMarkers();
      this.$apollo.queries.search.skip = false;
      var resultPromise = this.$apollo.queries.search.refetch({ term: event.target.value, latitude: this.lat, longitude: this.long, radius: 5000, limit: 15 })
      resultPromise.then(result => this.addMarker(result.data.search.business));
    },
    addMarker: function(queryResult) {
      for (var i = 0; i < queryResult.length; i++) {
        var business = queryResult[i];
        var currentMarker = new mapboxgl.Marker({
          draggable: false
        })
        .setLngLat([business.coordinates.longitude, business.coordinates.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3 class="pop-up-text">' + business.name + '</h3>'))
        .addTo(this.mainMap);
        markers.push(currentMarker);
      }
    },
    clearMarkers: function() {
      for (var i  = 0; i < markers.length; i++) {
        markers[i].remove();
      }
    }
  },
  created() {
    eventBus.$on('toggleDirections', (isVisible) => {
      console.log(isVisible)
    });
  },
  apollo: {
    search: gql`{
      search
      {
        total
        business {
          name
          coordinates {
            latitude
            longitude
          }
        }
      }
    }`
  },

  mounted(){
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjam9xM3gwYWYwMHlpM3ZrZmY4NWNwam9kIn0.TE3Zma1nEd5mbbdVCfQGMA';
  this.lat = 48.218800;
  this.long = 11.624707;
  this.$apollo.queries.search.skip = true;

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
      unit: 'metric',
      alternatives: true,
      congestion: true,
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
    .addControl(this.directions, 'bottom-left')

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
  height: 100%;
}
 
#map {
	width: 100%;
  height: 100%;
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

<style>
.mapboxgl-popup {
  max-width: 200px;
}

.mapboxgl-popup-content {
  text-align: center;
  font-family: 'Open Sans', sans-serif;
}

.pop-up-text {
  color: black;
}
</style>
