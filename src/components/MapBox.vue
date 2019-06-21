<template>
<div class="wrapper">
  <div v-if="!navigationMode" class="header-area">
    <ul class="map-function-switch">
      <li @click="activate(1), toggleNavigation()" :class="{ active : active_el == 1 }">Navigieren</li>
      <li @click="activate(2), toggleNavigation()" :class="{ active : active_el == 2 }">Entdecken</li>
    </ul>
  </div>
  <div v-if="active_el == 2" class="POI-controls-container">
    <input class="POI-Input" type="text" v-on:change="querySearch($event.target.value)"  placeholder="Hotel, Restaurant..."/>
    <v-btn fab dark small color="white" class="POI-filter-btn" v-on:click="directToFilterPage"> <!-- :to="{ name: 'poi'}"> -->
      <v-icon dark>filter_list</v-icon>
    </v-btn>
    <v-btn fab dark small color="white" class="POI-search-btn"
    v-on:click="searchPOI($event)"
    >
      <v-icon dark>subdirectory_arrow_right</v-icon>
    </v-btn>
    <div class="POI-suggestion-container">
      <v-btn color="white" dark fab small class="POI-suggestion-icon" @click="toggleDisplay()">
          <v-icon v-if="display" dark>keyboard_arrow_left</v-icon>
          <v-icon v-else dark>keyboard_arrow_right</v-icon>
      </v-btn>
      <v-btn v-if="display" color="blue-grey darken-1" dark fab class="POI-suggestion-icon" v-on:click="querySearch(null, 'autorepair')">
          <v-icon dark>build</v-icon>
      </v-btn>
      <v-btn v-if="display" color="deep-orange darken-1" dark fab class="POI-suggestion-icon" v-on:click="querySearch(null, 'food')">
          <v-icon dark>restaurant</v-icon>
      </v-btn>
      <v-btn v-if="display" color="blue" dark fab class="POI-suggestion-icon" v-on:click="querySearch(null, 'hotels')">
          <v-icon dark>hotel</v-icon>
      </v-btn>
      <v-btn v-if="display" color="orange" dark fab class="POI-suggestion-icon" v-on:click='querySearch("food")'> <!-- v-on:click='' -->
          <v-icon dark>shopping_cart</v-icon>
      </v-btn>
      <v-btn v-if="display" color="green darken-1" dark fab class="POI-suggestion-icon" v-on:click="querySearch(null, 'servicestations')">
          <v-icon dark>local_gas_station</v-icon>
      </v-btn>
      <v-btn v-if="display" color="red" dark fab class="POI-suggestion-icon" v-on:click="querySearch(null, 'physicians')">
          <v-icon dark>local_hospital</v-icon>
      </v-btn>
    </div>
  </div>
  <div v-if="active_el == 1" class="map-controls-container">
    <v-btn v-if="isVisible" fab dark small color="white" class="routing-button black--text"
    v-on:click="showRouting()"
    v-bind:class="{ change : isVisible }"
    >
      <v-icon dark>subdirectory_arrow_right</v-icon>
    </v-btn>
    <v-btn v-else fab dark small color="white" class="routing-button black--text"
    v-on:click="closeRouting()"
    v-bind:class="{ change : isVisible }"
    >
      <v-icon dark>close</v-icon>
    </v-btn>
    <v-btn v-if="displayNavigation" v-on:click="reverseDirections" fab dark small color="white" class="route-switch-button black--text">
      <v-icon dark>compare_arrows</v-icon>
    </v-btn>
    <v-btn v-if="routeReady & !navigationMode" v-on:click="startRoute" round color="blue" dark class="start-navigation-button">Start</v-btn>
  </div>
  <div id="map" ref="map"></div>
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
import { setTimeout } from 'timers';
import { poiQueries, poiFilterQuery } from '../shared_data/queries'

var markers = [];
var userLong = 0;
var userLat = 0;

var categoryArray = [
    ['food', '4d4b7105d754a06374d81259'],
    ['physicians', '4bf58dd8d48988d104941735'],
    ['autorepair', '56aa371be4b08b9a8d5734d3'],
    ['hotels', '4bf58dd8d48988d1fa931735'],
    ['servicestations', '4bf58dd8d48988d113951735']
];

export default {
  name: 'MapBox',
  data() {
    return {
      // newlong:'',
      // newlat:'',
      lat: Number,
      long: Number,
      mainMap: Object,
      marker: Object,
      geocoder: Object,
      directions: Object,
      aktPos: [],
      userLocation: Object,
      foursquareResponse: Object,
      isVisible: true,
      displayNavigation: false,
      routeReady: false,
      destination: Object,
      inputs: Object,
      inputStart: Object,
      inputDestination: Object,
      directionsProfile: Object,
      // locationHome: false,
      mapControl: Object,
      instructionUpdate: null,
      navigationMode: false,
      firstInstruction: [],
      active_el: 1,
      display: true,
      source: {
        yelp: true,
        foursquare: true,
        custom: true
      },
      category: {
        autorepair: false,
        food: false,
        hotels: false,
        servicestations: false,
        physicians: false
      },
      foursquareQuery: gql` query foursquarePOI ($latitude: Float!, $longitude: Float!, $term: String, $categories: String) 
      {
        foursquarePOI (latitude: $latitude, longitude: $longitude, term: $term, categories: $categories) 
          ${poiQueries.BODY_QUERY}
      }`,
      yelpQuery: gql` query yelpPOI ($latitude: Float!, $longitude: Float!, $term: String, $radius: Int, $limit: Int, $categories: String) 
      {
        yelpPOI (latitude: $latitude, longitude: $longitude, term: $term, radius: $radius, limit: $limit, categories: $categories)
          ${poiQueries.BODY_QUERY}      
        }`,
      customQuery: gql` query customPOI ($latitude: Float!, $longitude: Float!, $term: String!) 
      {
        customPOI (latitude: $latitude, longitude: $longitude, term: $term)
          ${poiQueries.BODY_QUERY}      
      }`
    }
  },
  methods: {
    // refresh: function(newlong, newlat){
    //   this.long = newlong;
    //   this.lat = newlat;
    //   this.marker.setLngLat([this.long, this.lat])
    //   this.mainMap.easeTo({
    //     duration: 3000,
    //     ease: 0.2,
    //     animate: true,
    //     center: [this.long, this.lat],
    //     zoom: 12,
    //     bearing: 0
    //   })
    // },
    // updateMarker: function(e){
    //   var newCenter = e.result.center;
    //   this.marker.setLngLat([newCenter[0],newCenter[1]]);
    //   this.long = newCenter[0];
    //   this.lat = newCenter[1];
    // },

    querySearch: function(term = null, quickCategory = null) {
      var source;
      var category;

      try {
        const filterParams = this.$apollo.provider.defaultClient.readQuery({
            query: poiFilterQuery
        });
        source = filterParams.poiFilter.source;
        if (quickCategory == null) {
          category = filterParams.poiFilter.category;
        }
      } catch (exception) {
        source = this.source;
      }

      if (quickCategory != undefined && quickCategory != null) {
        category = {};
        category[quickCategory] = true;
      }
      var query;

      if (source.yelp) {
          if (source.foursquare) {
              if (source.custom) {
                query = poiQueries.ALL_QUERY;
              } else {
                  query = poiQueries.FS_YELP_QUERY;
              }
          } else if (source.custom) {
              query = poiQueries.CUSTOM_YELP_QUERY;
          } else {
              query = poiQueries.YELP_ONLY_QUERY;
          }
      } else if (source.foursquare) {
        if (source.custom) {
            query = poiQueries.FS_CUSTOM_QUERY;
        } else {
            query = poiQueries.FS_ONLY_QUERY;
        }
      } else if (source.custom) {
          query = poiQueries.CUSTOM_ONLY_QUERY;
      }
      if (category != null && category != undefined) {
        var categories = this.getCategories(category);
      } else {
        var categories = {};
      }
      var center = this.mainMap.getBounds().getCenter();
      var lat = center.lat;
      var lng = center.lng;

      var variables = {
        latitude: lat,
        longitude: lng,
        limit: 15
      }

      if (term != undefined && term != null) {
          variables.term = term;
      }
      if (this.source.yelp && categories.yelpCategories != "") {
          variables.yelpCategories = categories.yelpCategories;
      }
      if (this.source.foursquare && categories.foursquareCategories != "") {
          variables.foursquareCategories = categories.foursquareCategories;
      }
      this.executeQuery(query, variables);
    },
    executeQuery: function(query, variables) {
      this.$apollo.query({
        query: query,
        variables: variables
      }).then((response) => {
        this.clearMarkers();
        var pois = response.data.getPOI;
        if (pois.customPOI != null && pois.customPOI != undefined) {
            this.addMarker(pois.customPOI, "#24c94d");
        }
        if (pois.foursquarePOI != null && pois.foursquarePOI != undefined) {
            this.addMarker(pois.foursquarePOI, "#1ecebc");
        }
        if (pois.yelpPOI != null && pois.yelpPOI != undefined) {
            this.addMarker(pois.yelpPOI, "#c64917");
        }
        if (pois.customPOI == null && pois.foursquarePOI.length < 1 && pois.yelpPOI.length < 1) {
          this.showPopUp("Kein Ort gefunden", "Ihr Suchbegriff ergab leider keine Ergebnisse", "white");
        }
      }).catch((response) => {
        console.log(response);
      });
    },
    addMarker: function(pois, color) {
      for (var i = 0; i < pois.length; i++) {
        var poi = pois[i];
        var currentMarker = new mapboxgl.Marker({
          draggable: false,
          color: color
        })
        .setLngLat([poi.coordinates.longitude, poi.coordinates.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3 class="pop-up-text">' + poi.name + '</h3>'))
        .addTo(this.mainMap);
        markers.push(currentMarker);
      }
    },  
    getCategories: function(category) {
      var keys = Object.keys(category);

      var filteredKeys = keys.filter(function(key) {
          return category[key] && key != "__typename";
      });

      var categoryMap = new Map(categoryArray);

      var yelpCategories = "";
      var foursquareCategories = "";

      filteredKeys.forEach(function(key) {
          if (yelpCategories != "") {
              yelpCategories += ",";
              foursquareCategories += ",";
          } 
          yelpCategories += key;
          foursquareCategories += categoryMap.get(key);
      })

      var categories = {
          yelpCategories: yelpCategories,
          foursquareCategories: foursquareCategories
      }; 
      return categories;
    },
    clearMarkers: function() {
      for (var i  = 0; i < markers.length; i++) {
        markers[i].remove();
      }
    },
    // searchPOI: function(searchTerm = undefined, categories = undefined) {
    //   var foursquareCategory = this.getIdByCategoryName(categories);
    //   this.clearMarkers();
    //   var center = this.mainMap.getBounds().getCenter();

    //   var lat = center.lat;
    //   var lng = center.lng;
    //   var customSearch = searchTerm;

    //   if (customSearch == null || customSearch == undefined) {
    //     customSearch = categories;
    //   }
    //   this.executeQuery(this.foursquareQuery, {term: searchTerm, latitude: lat, longitude: lng, categories: foursquareCategory}, "foursquare");
    //   this.executeQuery(this.yelpQuery, {term: searchTerm, latitude: lat, longitude: lng, radius: 5000, limit: 15, categories: categories}, "yelp");
    //   this.executeQuery(this.customQuery, {term: customSearch, latitude: lat, longitude: lng}, "custom");
    // },
    // getIdByCategoryName: function(name) {
    //   var id;
    //   switch(name) {
    //     case "food": id = "4d4b7105d754a06374d81259";
    //       break;
    //     case "physicians": id = "4bf58dd8d48988d104941735";
    //       break;
    //     case "autorepair": id = "56aa371be4b08b9a8d5734d3";
    //       break;
    //     case "hotels": id = "4bf58dd8d48988d1fa931735";
    //       break;
    //     case "servicestations": id = "4bf58dd8d48988d113951735";
    //       break;
    //   }
    //   return id;
    // },
    // Navigation
    showRouting: function() {
      if (this.setUserLocation()) {
      } else {
        this.showPopUp("GPS nicht gefunden", "Ihr aktueller GPS-Standort konnte nicht gefunden werden", "white");
      }
      this.isVisible = !this.isVisible;
      this.displayNavigation =!this.displayNavigation;
      this.destination.style.display = "block";
      this.directionsProfile.style.display = "block";
    },
    closeRouting: function() {
      this.mapControl.style.height = "unset";
      this.isVisible = !this.isVisible;
      this.navigationMode =!this.navigationMode;
      this.directions.removeRoutes();
      this.routeReady = false;
      this.inputs.style.display = "block";
      this.destination.style.display = "none";
      this.directionsProfile.style.display = "none";
      this.inputStart.value = null;
      this.inputDestination.value = null;
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].style.backgroundImage = "linear-gradient(90deg, #4285f4, #00ebff)";
      clearInterval(this.updateInstructions);
    },
    reverseDirections: function() {
      this.directions.reverse();
      var startValueTemp = this.inputStart.value;
      this.inputStart.value = this.inputDestination.value;
      this.inputDestination.value = startValueTemp;
    },
    startRoute: function() {
      this.mapControl.style.height = "100%";
      this.displayNavigation =!this.displayNavigation;
      this.navigationMode =!this.navigationMode;
      var instructions = document.getElementsByClassName('mapbox-directions-instructions')[0];
      var startButton = document.getElementsByClassName("start-navigation-button")[0];
      var directionsControl = document.getElementsByClassName("mapbox-directions-route-summary")[0].style.display = "none";
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].style.backgroundImage = "none";
      var altRoutes = document.getElementsByClassName("mapbox-directions-routes")[0];
      if (altRoutes) {
        altRoutes.style.display = "none";
      }
      instructions.style.display = "block";
      startButton.style.display = "none";
      this.inputs.style.display = "none";
      // this.showCurrentInstruction(); // Player Follow
      var instructions = document.getElementsByClassName('mapbox-directions-step')[0];
      var instructionLong = instructions.getAttribute('data-lng');
      var instructionLat = instructions.getAttribute('data-lat');
      this.mainMap.flyTo({
        center: [
          instructionLong,
          instructionLat
        ],
        zoom: 15,
        bearing: 151
      });
    },
    setUserLocation: function() {
      this.directions.setDestination(this.inputStart.value);
      if (userLong != 0 && userLat != 0) {
        this.directions.setOrigin([userLong, userLat]);
        this.inputStart.value = "Aktueller Standpunkt";
        return true;
      } else {
        return false;
      }
    },
    showCurrentInstruction: function() {
      var instructionsLength = document.getElementsByClassName('mapbox-directions-steps')[0].childNodes.length/2;
      for (var i = 2; i < instructionsLength-1; i++) {
        document.getElementsByClassName('mapbox-directions-step')[i].style.display = "none";
      }
      this.updateInstructions = setInterval(() => {
        //this.rotateMapAccordingToUserMovement();
        var currentLong = this.userLocation._lastKnownPosition.coords.longitude;
        var currentLat = this.userLocation._lastKnownPosition.coords.latitude;
        for (var i = 0; i < instructionsLength-1; i++) {
          var instructions = document.getElementsByClassName('mapbox-directions-step')[i];
          var instructionLong = instructions.getAttribute('data-lng');
          var instructionLat = instructions.getAttribute('data-lat');
          if (this.convertPositionsInMeter(currentLat, currentLong, instructionLat, instructionLong) < 15) {
            this.sleep(1000);
            var previousInstructions = document.getElementsByClassName('mapbox-directions-step')[i].style.display = "none";
            var nextInstructions = document.getElementsByClassName('mapbox-directions-step')[i+2].style.display = "block";
          } 
        }
      }, 1000)
	  },
    convertPositionsInMeter: function(lat1, lon1, lat2, lon2) {
      var R = 6378.137; // Radius of earth in KM
      var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
      var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return d * 1000; // meters
    },
    rotateMapAccordingToUserMovement: function() {
      var firstUserPos =  [this.userLocation._lastKnownPosition.coords.longitude, this.userLocation._lastKnownPosition.coords.latitude];
      this.sleep(1000);
      var secondUserPos =  [this.userLocation._lastKnownPosition.coords.longitude, this.userLocation._lastKnownPosition.coords.latitude];
      var y = Math.sin(secondUserPos[1]-firstUserPos[1]) * Math.cos(secondUserPos[0]);
      var x = Math.cos(firstUserPos[0])*Math.sin(secondUserPos[0]) - Math.sin(firstUserPos[0])*Math.cos(secondUserPos[0])*Math.cos(secondUserPos[1]-firstUserPos[1]);
      var brng = Math.atan2(y, x);
      var pi = Math.PI;
      var degrees = Math.abs(brng * (180/pi));

      this.mainMap.flyTo({
          bearing: degrees 
        });
    },
    sleep: function(miliseconds) {
      var currentTime = new Date().getTime();
      while (currentTime + miliseconds >= new Date().getTime()) {
      }
    },
    activate:function(el){
        this.active_el = el;
    },
    toggleDisplay: function(){
        this.display = !this.display;
    },
    toggleNavigation: function() {
      if (this.active_el == 2) {
        this.mapControl.style.display = "none";
        // this.directions.interactive = false; //TODO get working
      } else {
        this.mapControl.style.display = "block";
        // this.directions.interactive = true; // TODO get working
      }
    },
    showPopUp: function(title, text, color) {
      eventBus.$emit('showPopUp', title, text, color);
    },
    directToFilterPage: function() {
      var center = this.mainMap.getBounds().getCenter();
      var lat = center.lat;
      var lng = center.lng;

      var coordinates = {
        longitude: lng,
        latitude: lat
      }
      const coordinateMutation = gql`
        mutation ($coordinates: Object) {
            coordinateMutation(coordinates: $coordinates) @client
        }`;
      this.$apollo.mutate({
        mutation: coordinateMutation,
        variables: {coordinates} 
      })

      eventBus.$emit('poi_filter_coords', coordinates);
      this.$router.push('poi');
    }
  },
  beforeDestroy () {
    clearInterval(this.polling)
  },
  created(){
      eventBus.$on('toggleDirections', (isVisible) => {
      if(isVisible == true){
        this.mainMap.addControl(this.directions, 'bottom-left');
      } else {
        this.mainMap.removeControl(this.directions);
      }
    });
  },
  mounted(){
  // eventBus.$on('locationFromHome', (newDest)=>{
  //   this.refresh(newDest[0], newDest[1]);
  // });    
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjam9xM3gwYWYwMHlpM3ZrZmY4NWNwam9kIn0.TE3Zma1nEd5mbbdVCfQGMA';
  this.lat = 48.218800;
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
      unit: 'metric',
      alternatives: true,
      congestion: true,
      accessToken: mapboxgl.accessToken,
      placeholderOrigin: "Wo möchten Sie hin?" // fucking won't work
    }, 'bottom-left');

  console.log(this.directions);

  this.directions.on("route", e => {
    this.routeReady = true;
    console.log("route changed");
  })

  this.userLocation = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    instructions: false
  });

  this.mainMap
    .addControl(this.userLocation, 'bottom-right')
    .addControl(this.directions, 'top-left')

  this.mainMap.on("load", e => {
    this.userLocation.trigger();
  })

  this.userLocation.on('geolocate', function(e) {
      userLong = e.coords.longitude;
      userLat = e.coords.latitude;
  });


  this.destination = document.getElementsByClassName("mapbox-directions-destination")[0];
  this.inputs = document.getElementsByClassName("directions-control-inputs")[0];
  this.directionsProfile = document.getElementsByClassName("mapbox-directions-profile")[0];
  this.inputStart = document.getElementsByClassName('mapboxgl-ctrl-geocoder')[0].childNodes[1];
  this.inputDestination = document.getElementsByClassName('mapboxgl-ctrl-geocoder')[1].childNodes[1];
  this.mapControl = document.getElementsByClassName('mapboxgl-ctrl-top-left')[0];

  // this.geocoder.on('result', this.updateMarker);

  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

/* Custom CSS */

*:focus {
    outline: none;
}

.wrapper {
  width: 100vw;
  height: 100%;
}

#map {
	width: 100%;
  height: 100%;
  position: relative;
}

.map-controls-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
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

/* Map Navigation */

h5 {
  z-index: 9;
  position: absolute;
  right: 2rem;
  top: 1rem;
  font-size: 14pt;
  color: white;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact {
    display: none;  
}

.mapboxgl-ctrl-top-left {
  width: 100%;
  background-image: linear-gradient(90deg, #4285f4, #00ebff);
}

.mapboxgl-ctrl-top-left .mapboxgl-ctrl {
  max-width: 100%;
  margin: 10px;
  margin-right: 4rem;
  float: unset;
}

#mapbox-directions-origin-input, #mapbox-directions-destination-input {
    height: 2rem;
    border: 1px solid white;
    background-color: white;
    border-radius: 50px;
    padding-top: 0.6rem;
    padding-bottom: 2rem;
    padding-left: 1rem;
    padding-right: 10px;
}

.mapboxgl-ctrl-geocoder input[type='text'] {
  font-size: 16px !important;
  transform: scale(0.85);
  left: -1rem !important;
  width:100%;
  border:0;
  background-color:transparent;
  height:28px;
  color:rgba(0,0,0,.5);
  text-overflow:ellipsis;
  white-space:nowrap;
  overflow:hidden;
}

.mapboxgl-ctrl-geocoder input {
  width: 90%;
  height: 2rem;
}

.mapbox-directions-origin {
  padding-top: 3rem;
  padding-bottom: 0.5rem;
}

.mapbox-directions-origin label, .mapbox-directions-destination label {
  display: none;
}

button.directions-icon.directions-icon-reverse.directions-reverse.js-reverse-inputs {
  display: none !important;
}

.mapbox-directions-destination {
  display: none;
}

.routing-button {
    z-index: 9;
    float: right;
    top: 3.2rem;
}

.route-switch-button {
    position: absolute !important;
    z-index: 9;
    top: 6.5rem;
    right: 0rem;
    display: none;
}

.start-navigation-button {
    top: 13rem;
    right: 0rem;
    z-index: 9;
    position: absolute !important;
}

.mapboxgl-user-location-dot::before {
  left: 0;
}

/* Mapbox CSS */

/* Suggestions */
.mapboxgl-ctrl-geocoder ul {
  background-color:#fff;
  border-radius: 0 0 3px 3px;
  left:0;
  list-style:none;
  margin:0;
  padding:0;
  position:absolute;
  width:100%;
  top:100%;
  z-index:1000;
  overflow:hidden;
  // font-size:12px;
  }
.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl-geocoder ul,
.mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-geocoder ul {
  top:auto;
  bottom:100%;
}
.mapboxgl-ctrl-geocoder ul > li > a {
  clear:both;
  cursor:default;
  display:block;
  padding:5px 10px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  border-bottom:1px solid rgba(0,0,0,0.1);
  color:#404040;
}
.mapboxgl-ctrl-geocoder ul > li:last-child > a { border-bottom:none; }
.mapboxgl-ctrl-geocoder ul > li > a:hover {
  color:#202020;
  background-color:#f3f3f3;
  text-decoration:none;
  cursor:pointer;
}
.mapboxgl-ctrl-geocoder ul > li.active > a {
  color:#202020;
  background-color:#e3e3e3;
  text-decoration:none;
  cursor:pointer;
}

/* icons */
.geocoder-icon {
  display:inline-block;
  width:20px;
  height:20px;
  vertical-align:middle;
  background-repeat:no-repeat;
  }
  .geocoder-icon-search {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIj4NCiAgPHBhdGggZD0iTTguNSA0QzYgNCA0IDYgNCA4LjUgNCAxMSA2IDEzIDguNSAxMyA5LjQgMTMgMTAuMiAxMi44IDEwLjggMTIuM0wxMC45IDEyLjMgMTQuMyAxNS43QzE0LjUgMTUuOSAxNC43IDE2IDE1IDE2IDE1LjYgMTYgMTYgMTUuNiAxNiAxNSAxNiAxNC43IDE1LjkgMTQuNSAxNS43IDE0LjNMMTIuMyAxMC45IDEyLjMgMTAuOEMxMi44IDEwLjIgMTMgOS40IDEzIDguNSAxMyA2IDExIDQgOC41IDR6TTguNSA1LjVDMTAuMiA1LjUgMTEuNSA2LjggMTEuNSA4LjUgMTEuNSAxMC4yIDEwLjIgMTEuNSA4LjUgMTEuNSA2LjggMTEuNSA1LjUgMTAuMiA1LjUgOC41IDUuNSA2LjggNi44IDUuNSA4LjUgNS41eiIgZmlsbD0iIzAwMCIvPg0KPC9zdmc+);
    float: right;
    }
  .geocoder-icon-close {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgdmVyc2lvbj0iMS4xIiBoZWlnaHQ9IjIwIiB3aWR0aD0iMjAiPg0KICA8cGF0aCBkPSJtNSA1IDAgMS41IDMuNSAzLjUtMy41IDMuNSAwIDEuNSAxLjUgMCAzLjUtMy41IDMuNSAzLjUgMS41IDAgMC0xLjUtMy41LTMuNSAzLjUtMy41IDAtMS41LTEuNSAwLTMuNSAzLjUtMy41LTMuNS0xLjUgMHoiIGZpbGw9IiMwMDAiLz4NCjwvc3ZnPg==);
    display: none;
    }
  .geocoder-icon-loading {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxwYXRoIGQ9Im0xMCAyIDAgMy4zYzIuNiAwIDQuNyAyLjEgNC43IDQuN2wzLjMgMGMwLTQuNC0zLjYtOC04LTh6IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTEwIDJDNi44IDIgMy43IDQuMSAyLjYgNy4xIDEuNCAxMCAyLjEgMTMuNiA0LjUgMTUuOGMyLjQgMi40IDYuNCAyLjkgOS40IDEuMiAyLjUtMS40IDQuMi00LjIgNC4yLTctMS4xIDAtMi4yIDAtMy4zIDAgMC4xIDIuMi0xLjcgNC4zLTMuOCA0LjZDOC43IDE1IDYuNCAxMy44IDUuNyAxMS43IDQuOCA5LjcgNS42IDcuMSA3LjYgNiA4LjMgNS42IDkuMSA1LjMgMTAgNS4zYzAtMS4xIDAtMi4yIDAtMy4zeiIgc3R5bGU9ImZpbGw6IzAwMDtvcGFjaXR5OjAuMiIvPjwvc3ZnPg==);
    -webkit-animation: rotate 400ms linear infinite;
       -moz-animation: rotate 400ms linear infinite;
        -ms-animation: rotate 400ms linear infinite;
            animation: rotate 400ms linear infinite;
    }

/* Search, Close, Loading, Inputs */

.mapboxgl-ctrl-geocoder,
.mapboxgl-ctrl-geocoder *,
.mapboxgl-ctrl-geocoder *:after,
.mapboxgl-ctrl-geocoder *:before {
  -webkit-box-sizing:border-box;
     -moz-box-sizing:border-box;
          box-sizing:border-box;
  }
.mapboxgl-ctrl-geocoder {
  // font:15px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  position:relative;
  background-color:white;
  border-radius:0 0 3px 0;
  }
  .mapbox-directions-origin .mapboxgl-ctrl-geocoder {
    border-radius:0 3px 0 0;
    }

  .mapbox-directions-origin input[type='text'] {
    position:relative;
    z-index:1;
    // left: 0rem;
    // top: -0.3rem;
    height: 100%;
    }
    .mapbox-directions-destination input[type='text'] {
    position:relative;
    z-index:1;
    // left: 0rem;
    // top: -0.3rem;
    height: 100%;
    }
  // .mapboxgl-ctrl-geocoder input:focus {
  //   color:rgba(0,0,0,.75);
  //   outline:0;
  //   outline:thin dotted\8;
  //   }

.mapboxgl-ctrl-geocoder .geocoder-icon-search {
  position:absolute;
  top:0px;
  right:0px;
  }
.mapboxgl-ctrl-geocoder button {
  padding:0;
  margin:0;
  background-color:#fff;
  border:none;
  cursor:pointer;
  }
.mapboxgl-ctrl-geocoder .geocoder-pin-right * {
  background-color:#fff;
  z-index:2;
  position:absolute;
  right:0px;
  top:0px;
  display:none;
  }
  .mapboxgl-ctrl-geocoder .geocoder-pin-right *.active { display:block; }

  .mapbox-directions-profile {
  display: none;
  margin:7px 0 0;
  padding:2px;
  border-radius:15px;
  vertical-align:middle;
  padding-bottom: 1rem;
  }
  .mapbox-directions-profile label {
    cursor:pointer;
    vertical-align:top;
    display:block;
    border-radius:16px;
    padding:3px 5px;
    // font-size:12px;
    color:rgba(0,0,0,.5);
    line-height:20px;
    text-align:center;
    width: 25%;
    float:left;
    }
    .mapbox-directions-profile label:hover {
      color:rgba(0,0,0,.75);
      }
  .mapbox-directions-profile input[type=radio] {
    display:none;
    }
  .mapbox-directions-profile input[type=radio]:checked + label:hover,
  .mapbox-directions-profile input[type=radio]:checked + label {
    background:#eee;
    color:rgba(0,0,0,.75);
    }

/* Route Summary */
.mapbox-directions-route-summary {
  position: relative;
  z-index:1;
  width:100%;
  color:#fff;
  padding:5px 10px;
  font-size:15px;
  line-height:28px;
  }
  .mapbox-directions-route-summary h1 {
    font-weight:500;
    margin:0;
    display:inline;
    font-size:inherit;
    line-height:inherit;
    }
  .mapbox-directions-route-summary span {
    margin:0 5px;
    }

  /* Alt route selection */
  .mapbox-directions-instructions {
      overflow: scroll;
/* Recent */
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 15px;
      height: 10rem;
      margin-bottom: 1rem;
      margin-right: -3.3rem;
      width: 94%;
      position: absolute;
      bottom: 2rem;
    }
    .mapbox-directions-instructions-wrapper {
      max-height: 17vh;
      }
  .mapbox-directions-routes {
    margin-right: -4rem; // Not so Responsive
    font-size:12px;
    float: left;
    }
  .mapbox-directions-routes input[type=radio] { display: none;}
  .mapbox-directions-routes input[type=radio]:not(:checked) + .button:before { width: 0;}
  .mapbox-directions-routes input[type=radio] + label {
    background-color:rgba(255,255,255,0.10);
    float:left;
    padding:0 10px;
    cursor:pointer;
    }
    .mapbox-directions-routes input[type=radio] + label:hover,
    .mapbox-directions-routes input[type=radio]:checked + label {
      background-color:rgba(255,255,255,0.25);
      }

/* Instructions */
  .mapbox-directions-instructions {
    display: none;
  }
   
  .mapboxgl-popup {
    max-width: 200px;
  }

  .mapboxgl-popup-content {
    text-align: center;
    font-family: 'Open Sans', sans-serif;
  }
  .mapbox-directions-instructions .directions-icon {
    position:absolute;
    left:12px;
    top:20px;
    margin:auto;
  }
  .mapbox-directions-instructions .directions-icon:before {
    vertical-align:top;
    }

  .mapbox-directions-error {
    padding:20px;
    font-size:20px;
    line-height:25px;
  }
  .mapbox-directions-step-distance {
    color:rgba(255,255,255,.5);
    position:absolute;
    padding:5px 10px;
    font-size:12px;
    left:30px;
    bottom:-10px;
  }
  .mapbox-directions-steps {
    position:relative;
    list-style:none;
    margin:0;
    padding:0;
  }
  .mapbox-directions-step {
    position:relative;
    color:rgba(255,255,255,.75);
    cursor:pointer;
    padding:20px 20px 20px 40px;
    font-size:14px;
    line-height:18px;
    font-weight: 300;
    letter-spacing:0.1em;
    }
  .mapbox-directions-step * { pointer-events:none; }
  .mapbox-directions-step:hover {
    color:white;
  }
  .mapbox-directions-step:after {
    content:'';
    position:absolute;
    top:45px;
    bottom:-10px;
    border-left:2px dotted rgba(255,255,255,.2);
    left:20px;
  }
  .mapbox-directions-step:last-child:after,
  .mapbox-directions-step:last-child .mapbox-directions-step-distance {
    display:none;
  }

  .mapbox-marker-drag-icon {
    display:block;
    background-color:#444;
    border-radius:50%;
    box-shadow:0 0 5px 0 rgba(0,0,0,0.5);
  }
  .mapbox-marker-drag-icon-step {
    background-color:#3BB2D0;
  }

  .mapbox-directions-clearfix:after {
    content:'';
    display:block;
    height:0;
    clear:both;
    visibility:hidden;
  }

// /* Containers */
 .directions-control.directions-control { width:100%; max-width:100%; }

@-webkit-keyframes rotate { from { -webkit-transform: rotate(0deg); } to { -webkit-transform: rotate(360deg); } }
   @-moz-keyframes rotate { from { -moz-transform: rotate(0deg); } to { -moz-transform: rotate(360deg); } }
    @-ms-keyframes rotate { from { -ms-transform: rotate(0deg); } to { -ms-transform: rotate(360deg); } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* icons */
.directions-icon {
  display:inline-block;
  width:20px;
  height:20px;
  vertical-align:middle;
  speak:none;
  background-repeat:no-repeat;
  }
  .directions-icon-arrive {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgaWQ9InN2ZzUzMjciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDIwIDIwIj48ZGVmcyBpZD0iZGVmczUzMjkiLz48bWV0YWRhdGEgaWQ9Im1ldGFkYXRhNTMzMiIvPjxnIGlkPSJsYXllcjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48ZyBpZD0iZzU5MzYiIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEsMjAwNC43MjQ0KSIgb3BhY2l0eT0iMC41Ii8+PGcgaWQ9Imc1OTMyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLC0yKSIvPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEsMjAyNC43MjQ0KSIgaWQ9Imc2MDM4IiBmaWxsPSIjZmZmIi8+PGcgaWQ9InRleHQ2NjA2IiBzdHlsZT0iLWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonT3BlbiBTYW5zIEJvbGQnO2Jsb2NrLXByb2dyZXNzaW9uOnRiO2NvbG9yOiNGRkY7ZGlyZWN0aW9uOmx0cjtkaXNwbGF5OmlubGluZTtlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6I0ZGRjtmb250LWZhbWlseTonT3BlbiBTYW5zJztmb250LXNpemU6MTYuODE7Zm9udC13ZWlnaHQ6Ym9sZDtsZXR0ZXItc3BhY2luZzpub3JtYWw7bGluZS1oZWlnaHQ6MTI1O292ZXJmbG93OnZpc2libGU7dGV4dC1hbGlnbjpjZW50ZXI7dGV4dC1hbmNob3I6bWlkZGxlO3RleHQtZGVjb3JhdGlvbi1saW5lOm5vbmU7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC1pbmRlbnQ6MDt0ZXh0LXRyYW5zZm9ybTpub25lO3dvcmQtc3BhY2luZzpub3JtYWw7d3JpdGluZy1tb2RlOmxyLXRiIj48cGF0aCBkPSJtMzIwNiA5OTYuMzYgMy43MyAwcTIuNTUgMCAzLjcgMC43MyAxLjE2IDAuNzIgMS4xNiAyLjMxIDAgMS4wOC0wLjUxIDEuNzYtMC41IDAuNjktMS4zNCAwLjgzbDAgMC4wOHExLjE0IDAuMjUgMS42NCAwLjk1IDAuNTEgMC43IDAuNTEgMS44NiAwIDEuNjQtMS4xOSAyLjU2LTEuMTggMC45Mi0zLjIyIDAuOTJsLTQuNDkgMCAwLTEyem0yLjU0IDQuNzUgMS40OCAwcTEuMDMgMCAxLjQ5LTAuMzIgMC40Ny0wLjMyIDAuNDctMS4wNiAwLTAuNjktMC41MS0wLjk4LTAuNS0wLjMtMS41OS0wLjNsLTEuMzQgMCAwIDIuNjd6bTAgMi4wMiAwIDMuMTMgMS42NiAwcTEuMDUgMCAxLjU1LTAuNCAwLjUtMC40IDAuNS0xLjIzIDAtMS40OS0yLjEzLTEuNDlsLTEuNTggMHoiIGlkPSJwYXRoMjcyMTIiLz48L2c+PC9nPjwvc3ZnPg==);
  }
  .directions-icon-slight-left {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48cGF0aCBkPSJtMzIwNiA5OTYuNCAwIDcuNSAzLjEtMy4xIDIuOSAzIDAgNC42IDIgMCAwLTUuNC0zLjUtMy41IDMtM3oiIGZpbGw9IiNGRkYiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwtMSwxLDIwMDQuNzI0NCkiIG9wYWNpdHk9IjAuNSIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEsLTIpIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMSwyMDI0LjcyNDQpIiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==);
  }
  .directions-icon-slight-right {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48cGF0aCBkPSJtMzIwNi41IDk5Ni40IDMgMy0zLjUgMy41IDAgNS40IDIgMCAwLTQuNiAyLjktMyAzLjEgMy4xIDAtNy41eiIgZmlsbD0iI0ZGRiIvPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEsMjAwNC43MjQ0KSIgb3BhY2l0eT0iMC41Ii8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMSwtMikiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwtMSwxLDIwMjQuNzI0NCkiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+);
    }
  .directions-icon-straight {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48cGF0aCBkPSJtMzIxNS41IDEwMDEuNC01LjUtNS41LTUuNSA1LjUgNC41IDAgMCA3IDIgMCAwLTd6IiBmaWxsPSIjRkZGIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMSwyMDA0LjcyNDQpIiBvcGFjaXR5PSIwLjUiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLC0yKSIvPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEsMjAyNC43MjQ0KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0zNDA3IDk0Ny40LTIgNiA3LjMgMC0yIDYgMiAwIDQtMTItMS4yIDB6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==);
  }
  .directions-icon-depart {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgaWQ9InN2ZzUzMjciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDIwIDIwIj48ZGVmcyBpZD0iZGVmczUzMjkiLz48bWV0YWRhdGEgaWQ9Im1ldGFkYXRhNTMzMiIvPjxnIGlkPSJsYXllcjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48ZyBpZD0iZzU5MzYiIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEsMjAwNC43MjQ0KSIgb3BhY2l0eT0iMC41Ii8+PGcgaWQ9Imc1OTMyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLC0yKSIvPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEsMjAyNC43MjQ0KSIgaWQ9Imc2MDM4IiBmaWxsPSIjZmZmIi8+PGcgaWQ9InRleHQ2NTkzIiBzdHlsZT0iLWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonT3BlbiBTYW5zIEJvbGQnO2Jsb2NrLXByb2dyZXNzaW9uOnRiO2NvbG9yOiNGRkY7ZGlyZWN0aW9uOmx0cjtkaXNwbGF5OmlubGluZTtlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6I0ZGRjtmb250LWZhbWlseTonT3BlbiBTYW5zJztmb250LXNpemU6MTYuNzQ7Zm9udC13ZWlnaHQ6Ym9sZDtsZXR0ZXItc3BhY2luZzpub3JtYWw7bGluZS1oZWlnaHQ6MTI1O292ZXJmbG93OnZpc2libGU7dGV4dC1hbGlnbjpjZW50ZXI7dGV4dC1hbmNob3I6bWlkZGxlO3RleHQtZGVjb3JhdGlvbi1saW5lOm5vbmU7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC1pbmRlbnQ6MDt0ZXh0LXRyYW5zZm9ybTpub25lO3dvcmQtc3BhY2luZzpub3JtYWw7d3JpdGluZy1tb2RlOmxyLXRiIj48cGF0aCBkPSJtMzIxMy4wNCAxMDA4LjM2LTAuODctMi44NC00LjM2IDAtMC44NyAyLjg0LTIuNzMgMCA0LjIyLTEyIDMuMSAwIDQuMjMgMTItMi43MyAwem0tMS40Ny00Ljk3cS0xLjItMy44Ny0xLjM2LTQuMzctMC4xNS0wLjUxLTAuMjEtMC44LTAuMjcgMS4wNS0xLjU0IDUuMTdsMy4xMSAweiIgaWQ9InBhdGgyNzIwOSIvPjwvZz48L2c+PC9zdmc+);
  }
  .directions-icon-roundabout {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48cGF0aCBkPSJtMzIxMCA5OTUuNGMtMS41IDAtMy4xIDAuNi00LjIgMS43LTIuMyAyLjMtMi4zIDYuMiAwIDguNWwxLjQtMS40Yy0xLjYtMS42LTEuNi00LjEgMC01LjYgMS42LTEuNiA0LjEtMS42IDUuNiAwIDEuNiAxLjYgMS42IDQuMSAwIDUuNi0wLjggMC44LTEuOCAxLjItMi44IDEuMmwtMSAwIDAgNCAyIDAgMC0yLjFjMS4yLTAuMiAyLjQtMC44IDMuMy0xLjcgMi4zLTIuMyAyLjMtNi4yIDAtOC41LTEuMi0xLjItMi43LTEuNy00LjItMS43eiIgc3R5bGU9Ii1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246U2FucztiYXNlbGluZS1zaGlmdDpiYXNlbGluZTtibG9jay1wcm9ncmVzc2lvbjp0YjtkaXJlY3Rpb246bHRyO2ZpbGw6I0ZGRjtmb250LWZhbWlseTpTYW5zO2ZvbnQtc2l6ZTptZWRpdW07bGV0dGVyLXNwYWNpbmc6bm9ybWFsO2xpbmUtaGVpZ2h0Om5vcm1hbDt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtYW5jaG9yOnN0YXJ0O3RleHQtZGVjb3JhdGlvbi1saW5lOm5vbmU7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC1pbmRlbnQ6MDt0ZXh0LXRyYW5zZm9ybTpub25lO3dvcmQtc3BhY2luZzpub3JtYWw7d3JpdGluZy1tb2RlOmxyLXRiIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMSwyMDA0LjcyNDQpIiBvcGFjaXR5PSIwLjUiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLC0yKSIvPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEsMjAyNC43MjQ0KSIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=);
  }
  .directions-icon-error {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwtMSwxLDIwMDQuNzI0NCkiIG9wYWNpdHk9IjAuNSIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEsLTIpIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMSwyMDI0LjcyNDQpIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTMyMTAgOTk2LjRjLTAuNiAwLTEuMiAwLjMtMS41IDAuOGwtNC4zIDkuMmMtMC41IDAuOCAwIDIgMS4xIDJsNC43IDAgNC43IDBjMS4xIDAgMS42LTEuMiAxLjEtMmwtNC4zLTkuMmMtMC4zLTAuNS0wLjktMC44LTEuNS0wLjh6bTAgMyAxIDEgMCAzLTIgMCAwLTN6bS0xIDUgMiAwIDAgMi0yIDB6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg==);
  }
  .directions-icon-reverse {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwtMSwxLDIwMDQuNzI0NCkiIG9wYWNpdHk9IjAuNSIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEsLTIpIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMSwyMDI0LjcyNDQpIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTMyMTAgOTk1LjktNC41IDQuNSAzLjUgMCAwIDQtMy41IDAgNC41IDQuNSA0LjUtNC41LTMuNSAwIDAtNCAzLjUgMC00LjUtNC41eiIgZmlsbD0iIzAwMCIvPjwvZz48L3N2Zz4=);
  }
  .directions-icon-sharp-left {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48cGF0aCBkPSJtMzIxMy42IDk5Ni40LTYuNSA2LjUtMy0zIDAgNy41IDcuNSAwLTMuMS0zLjEgNC42LTQuNSAwIDUuNiAyIDAgMC04LTEuNC0xeiIgZmlsbD0iI0ZGRiIvPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEsMjAwNC43MjQ0KSIgb3BhY2l0eT0iMC41Ii8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMSwtMikiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwtMSwxLDIwMjQuNzI0NCkiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+);
  }
  .directions-icon-sharp-right {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48cGF0aCBkPSJtMzIwNi40IDk5Ni40LTEuNCAxIDAgOCAyIDAgMC01LjYgNC42IDQuNS0zLjEgMy4xIDcuNSAwIDAtNy41LTMgMy02LjUtNi41eiIgZmlsbD0iI0ZGRiIvPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEsMjAwNC43MjQ0KSIgb3BhY2l0eT0iMC41Ii8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMSwtMikiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwtMSwxLDIwMjQuNzI0NCkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtMzQwNyA5NDcuNC0yIDYgNy4zIDAtMiA2IDIgMCA0LTEyLTEuMiAweiIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=);
  }
  .directions-icon-left {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48cGF0aCBkPSJtMzIwOSA5OTUuOSAwIDQuNSA1IDAgMSAxIDAgNi0yIDAgMC01LTQgMCAwIDQuNS01LjUtNS41eiIgc3R5bGU9Ii1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246U2FucztiYXNlbGluZS1zaGlmdDpiYXNlbGluZTtibG9jay1wcm9ncmVzc2lvbjp0YjtkaXJlY3Rpb246bHRyO2ZpbGw6I0ZGRjtmb250LWZhbWlseTpTYW5zO2ZvbnQtc2l6ZTptZWRpdW07bGV0dGVyLXNwYWNpbmc6bm9ybWFsO2xpbmUtaGVpZ2h0Om5vcm1hbDt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtYW5jaG9yOnN0YXJ0O3RleHQtZGVjb3JhdGlvbi1saW5lOm5vbmU7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC1pbmRlbnQ6MDt0ZXh0LXRyYW5zZm9ybTpub25lO3dvcmQtc3BhY2luZzpub3JtYWw7d3JpdGluZy1tb2RlOmxyLXRiIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMSwyMDA0LjcyNDQpIiBvcGFjaXR5PSIwLjUiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLC0yKSIvPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEsMjAyNC43MjQ0KSIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=);
  }
  .directions-icon-right {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48cGF0aCBkPSJtMzIxMSA5OTUuOSAwIDQuNS01IDAtMSAxIDAgNiAyIDAgMC01IDQgMCAwIDQuNSA1LjUtNS41eiIgc3R5bGU9Ii1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246U2FucztiYXNlbGluZS1zaGlmdDpiYXNlbGluZTtibG9jay1wcm9ncmVzc2lvbjp0YjtkaXJlY3Rpb246bHRyO2ZpbGw6I0ZGRjtmb250LWZhbWlseTpTYW5zO2ZvbnQtc2l6ZTptZWRpdW07bGV0dGVyLXNwYWNpbmc6bm9ybWFsO2xpbmUtaGVpZ2h0Om5vcm1hbDt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtYW5jaG9yOnN0YXJ0O3RleHQtZGVjb3JhdGlvbi1saW5lOm5vbmU7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC1pbmRlbnQ6MDt0ZXh0LXRyYW5zZm9ybTpub25lO3dvcmQtc3BhY2luZzpub3JtYWw7d3JpdGluZy1tb2RlOmxyLXRiIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMSwyMDA0LjcyNDQpIiBvcGFjaXR5PSIwLjUiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLC0yKSIvPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEsMjAyNC43MjQ0KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0zNDA3IDk0Ny40LTIgNiA3LjMgMC0yIDYgMiAwIDQtMTItMS4yIDB6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==);
  }
  .directions-icon-u-turn {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48cGF0aCBkPSJtMzIwOSA5OTYuNGMtMS43IDAtMy4xIDAuNi0zLjkgMS42LTAuOCAxLTEuMSAyLjItMS4xIDMuNGwwIDYgMiAwIDAtNmMwLTAuOCAwLjItMS42IDAuNy0yLjEgMC40LTAuNSAxLjEtMC45IDIuMy0wLjkgMS4zIDAgMS45IDAuNCAyLjMgMC45IDAuNCAwLjUgMC43IDEuMyAwLjcgMi4xbDAgMi00LjUgMCA1LjUgNS41IDUuNS01LjUtNC41IDAgMC0yYzAtMS4yLTAuMy0yLjQtMS4xLTMuNC0wLjgtMS0yLjItMS42LTMuOS0xLjZ6IiBzdHlsZT0iLWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjpTYW5zO2Jhc2VsaW5lLXNoaWZ0OmJhc2VsaW5lO2Jsb2NrLXByb2dyZXNzaW9uOnRiO2RpcmVjdGlvbjpsdHI7ZmlsbDojRkZGO2ZvbnQtZmFtaWx5OlNhbnM7Zm9udC1zaXplOm1lZGl1bTtsZXR0ZXItc3BhY2luZzpub3JtYWw7bGluZS1oZWlnaHQ6bm9ybWFsO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb246bm9uZTt0ZXh0LWluZGVudDowO3RleHQtdHJhbnNmb3JtOm5vbmU7d29yZC1zcGFjaW5nOm5vcm1hbDt3cml0aW5nLW1vZGU6bHItdGIiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwtMSwxLDIwMDQuNzI0NCkiIG9wYWNpdHk9IjAuNSIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEsLTIpIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMSwyMDI0LjcyNDQpIiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==);
  }
  .directions-icon-waypoint {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjAwLC05OTIuMzYyMTgpIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwtMSwxLDIwMDQuNzI0NCkiIG9wYWNpdHk9IjAuNSIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEsLTIpIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMSwyMDI0LjcyNDQpIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTMyMTUgMTAwMS40YzAgMi44LTUgOC01IDggMCAwLTUtNS4yLTUtOCAwLTIuOCAyLjItNSA1LTUgMi44IDAgNSAyLjIgNSA1eiIgZmlsbD0iI0ZGRiIvPjwvZz48L3N2Zz4=);
  }

.pop-up-text {
  color: black;
}

// GPS Icon

.mapboxgl-ctrl-bottom-right .mapboxgl-ctrl {
    margin: 0 5px 5px 0;
    float: right;
}

// POI Controls

.POI-controls-container {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 9;
  background-image: linear-gradient(90deg, #4285f4, #00ebff);
  height: 7rem;
  .v-btn--floating.v-btn--small .v-icon {
    color: black;
  }
  .POI-Input {
    height: 2rem;
    border: 1px solid white;
    background-color: white;
    border-radius: 50px;
    padding-top: 1.3rem;
    padding-bottom: 1.3rem;
    padding-left: 1rem;
    padding-right: 25%;
    margin-top: 3.7rem;
    float: left;
    margin-left: 0.8rem;
  }
  .POI-search-btn {
    top: 3.2rem;
    position: absolute !important;
    right: 0rem;
  }
  .POI-filter-btn {
    position: absolute !important;
    top: 3.2rem;
    right: 3.5rem;
    .v-btn__content {
      height: unset;
    }
  }
  .POI-suggestion-container {
    position: absolute;
    top: 100%;
    .POI-suggestion-icon {
      width: 39px;
      height: 39px;
      margin: 7px;
    }
  }
}

.map-function-switch {
    position: absolute;
    top: 9px;
    z-index: 10;
        right: 0.5rem;
    padding: 0.5rem 0.2rem 0.5rem 0.2rem;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50px;
    li {
      display: inline;
      padding-left: 5px;
      padding-right: 5px;
      padding-top: 5px;
      padding-bottom: 5px;
      color: white;
    }
}

.active {
    background-color: dodgerblue;
    border-radius: 50px;
    color: white;
    display: block;
}

.header-area {
    position: absolute;
    height: 2.8rem;
    width: 100%;
    top: 0;
    z-index: 16;
}

@media screen and (max-width: 372px) {
  .POI-controls-container {
    .POI-Input {
      padding-right: 0;
      width: 67%;
    }
    .POI-search-btn {
      width: 37px;
      height: 37px;
    }
    .POI-filter-btn {
      height: 37px;
      width: 37px;
      right: 3rem;
    }
    .POI-suggestion-container {
      .POI-suggestion-icon {
        width: 37px;
        height: 37px;
        margin: 4px;
      }
    }
  }
}

</style>
