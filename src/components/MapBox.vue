<template>
<div class="wrapper">
  <!-- <div ref="custom-marker" class="custom-marker"></div> -->
  <input type="text" v-on:change="searchPOI($event)"  placeholder="Discover.."/>
  <div class="map-controls-container">
    <h5>Navigieren</h5>
    <v-btn fab dark small color="white" class="routing-button black--text"
    v-on:click="showRouting()"
    v-bind:class="{ change : isVisible }"
    >
      <v-icon v-if="isVisible" dark>subdirectory_arrow_right</v-icon>
      <v-icon v-else dark>close</v-icon>
    </v-btn>
    <v-btn v-if="displayNavigation" v-on:click="reverseDirections" fab dark small color="white" class="route-switch-button black--text">
      <v-icon dark>compare_arrows</v-icon>
    </v-btn>
    <v-btn v-if="routeReady" v-on:click="startRoute" round color="blue" dark class="start-navigation-button">Start</v-btn>
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

var markers = [];
var userLong = 0;
var userLat = 0;

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
      isVisible: true,
      displayNavigation: false,
      routeReady: false
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
    },
    showRouting: function() {
      this.setUserLocation();
      this.isVisible = !this.isVisible;
      this.displayNavigation =!this.displayNavigation;
      var destination = document.getElementsByClassName("mapbox-directions-destination")[0];
      var directionsProfile = document.getElementsByClassName("mapbox-directions-profile")[0];
      var inputs = document.getElementsByClassName("directions-control-inputs")[0];
      // var instructions = document.getElementsByClassName('mapbox-directions-instructions')[0];
      // instructions.style.cssText = "display: none;";
      if (destination.style.display == "block") {
        destination.style.display = "none";
        directionsProfile.style.display = "none";
        this.directions.removeRoutes();
        inputs.style.display = "block";
      } else {
        destination.style.display = "block";
        directionsProfile.style.display = "block";
      }
    },
    reverseDirections: function() {
      this.directions.reverse();
      //this.displayNavigation = true;
    },
    startRoute: function() {
      // var blur = document.getElementsByClassName('mapboxgl-ctrl-geocoder')[1].childNodes[1];
      // blur.blur();
      // var focus = document.getElementsByClassName('mapboxgl-ctrl-geocoder')[0].childNodes[1];
      // focus.focus();
      // console.log(focus);
      var instructions = document.getElementsByClassName('mapbox-directions-instructions')[0];
      var inputs = document.getElementsByClassName("directions-control-inputs")[0];
      var startButton = document.getElementsByClassName("start-navigation-button")[0];

      //var altRoutes = document.getElementsByClassName("mapbox-directions-routes")[0];
      var navigation = document.getElementsByClassName("mapboxgl-ctrl-top-left")[0];
      //altRoutes.style.display = "none";
      instructions.style.display = "block";
      startButton.style.display = "none";
      inputs.style.display = "none";
    },
    setUserLocation: function() {
      var inputStart = document.getElementsByClassName('mapboxgl-ctrl-geocoder')[0].childNodes[1];
      var inputDestination = document.getElementsByClassName('mapboxgl-ctrl-geocoder')[1].childNodes[1];

      this.directions.setDestination(inputStart.value);
      this.directions.setOrigin([userLong, userLat]);
      inputStart.value = "Aktueller Standpunkt";
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
      // controls: {
      //     instructions: false
      //   },
      accessToken: mapboxgl.accessToken
    }, 'bottom-left');

  this.directions.on("route", e => {
    this.routeReady = true;
    console.log("route changed");
  })

  this.userLocation = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  });

  this.mainMap
    //.addControl(this.geocoder, 'top-right')
    .addControl(this.userLocation, 'bottom-right')
    .addControl(this.directions, 'top-left')


  this.mainMap.on("load", e => {
    this.userLocation.trigger();
  })

  //this.userLocation.trigger();

  this.userLocation.on('geolocate', function(e) {
      userLong = e.coords.longitude;
      userLat = e.coords.latitude;
      // console.log(userLong);
      // console.log(userLat);
  });
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
<style lang="scss">

/* Custom CSS */

.wrapper{
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

// .geocoder {
//     position:absolute;
//     z-index:1;
//     width:50%;
//     left:50%;
//     margin-left:-25%;
//     top:20px;
// }

// .mapboxgl-ctrl-geocoder {
//     min-width:100%;
// }

@media only screen and (max-width: 599px) {

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


.mapboxgl-ctrl-top-left {
  width: 100%;
  background-image: linear-gradient(90deg, #4285f4, #00ebff);
}

.mapboxgl-ctrl-top-left .mapboxgl-ctrl {
  width: 79%;
  //margin: 10px !important;
  margin-left: 1.4rem;
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

#mapbox-directions-destination-input {
  // margin-top: 0.5rem;
}

// #mapbox-directions-destination-input .mapboxgl-ctrl-geocoder span.geocoder-icon.geocoder-icon-search {
//   display: none;
// }

.mapboxgl-ctrl-geocoder input {
  width: 90%;
  height: 2rem;
  margin-top: -1rem;
}

.mapboxgl-ctrl-geocoder input::placeholder {
  color: black;
  font-size: 10pt;
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
    // top: 3.2rem;
    // right: -11.6rem;
    float: right;
    top: 3.2rem;
}

.route-switch-button {
  z-index: 9;
  top: 6.5rem;
  position: absolute;
  right: -11.4rem;
  display: none;
}

.start-navigation-button {
  top: 12.5rem;
  right: -4rem;
  z-index: 9;
  z-index: 9;
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
  font-size:12px;
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

@-webkit-keyframes rotate { from { -webkit-transform: rotate(0deg); } to { -webkit-transform: rotate(360deg); } }
   @-moz-keyframes rotate { from { -moz-transform: rotate(0deg); } to { -moz-transform: rotate(360deg); } }
    @-ms-keyframes rotate { from { -ms-transform: rotate(0deg); } to { -ms-transform: rotate(360deg); } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* icons */
.geocoder-icon {
  display:inline-block;
  width:20px;
  height:20px;
  vertical-align:middle;
  //speak:none;
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
  font:15px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  position:relative;
  background-color:white;
  // width:calc(100% - 360px);;
  // min-width:calc(100% - 40px);;
  // max-width:calc(100% - 40px);;
  //margin-left:40px;
  border-radius:0 0 3px 0;
  }
  .mapbox-directions-origin .mapboxgl-ctrl-geocoder {
    border-radius:0 3px 0 0;
    }

.mapboxgl-ctrl-geocoder input[type='text'] {
  font-size:12px;
  width:100%;
  border:0;
  background-color:transparent;
  height:28px;
  margin:0;
  color:rgba(0,0,0,.5);
  padding:10px 40px 10px 10px;
  text-overflow:ellipsis;
  white-space:nowrap;
  overflow:hidden;

  }
  .mapbox-directions-origin input[type='text'] {
    // box-shadow:0 1px 0 0 #ddd;
    position:relative;
    z-index:1;
    left: 0rem;
    top: -0.3rem;
    }
    .mapbox-directions-destination input[type='text'] {
    // box-shadow:0 1px 0 0 #ddd;
    position:relative;
    z-index:1;
    left: 0rem;
    top: -0.3rem;
    }
  .mapboxgl-ctrl-geocoder input:focus {
    color:rgba(0,0,0,.75);
    outline:0;
    outline:thin dotted\8;
    }

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

// .mapboxgl-ctrl-geocoder,
// .mapboxgl-ctrl-geocoder ul {
//   box-shadow:none;
//   }

/* Profile */
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
    font-size:12px;
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
  // background-color:rgba(0,0,0,0.75);
  color:#fff;
  padding:5px 10px;
  font-size:15px;
  line-height:28px;
  }
  .mapbox-directions-route-summary + .mapbox-directions-instructions {
    }
  .mapbox-directions-route-summary h1 {
    font-weight:500;
    margin:0;
    display:inline;
    font-size:inherit;
    line-height:inherit;
    }
  .mapbox-directions-route-summary span {
    // color:rgba(255,255,255,0.5);
    margin:0 5px;
    }

  /* Alt route selection */
  .mapbox-directions-instructions {
      overflow: scroll;
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
</style>

<style lang="scss">
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

/* Mobile */
 @media only screen and (max-width:640px)  {

}

// /* Containers */
 .directions-control.directions-control { width:100%; max-width:100%; }

// /* Input container */
// .directions-control.directions-control-inputs { top:0;left:0; }
// .mapbox-directions-profile { margin:10px; }

// /* Instructions container */
// .mapbox-directions-routes { float:right; margin-right:10px; }
// .directions-control.directions-control-directions { top:auto; max-height:40%; }
// .mapbox-directions-multiple { min-height:50px; }

// }

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
</style>
