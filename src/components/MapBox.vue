<template>
<div class="wrapper">
  <!-- <div ref="custom-marker" class="custom-marker"></div> -->
  <h3>Navigieren</h3>
  <div id="map" ref="map">
    <!-- <button class="" type="button">Click Me!</button> -->
    <v-btn fab dark small color="white" class="routing-button black--text"
    v-on:click="showRouting()"
    v-bind:class="{ change : isVisible }"
    >
      <v-icon v-if="isVisible" dark>subdirectory_arrow_right</v-icon>
      <v-icon v-else dark>close</v-icon>
    </v-btn>
    <v-btn v-if="!isVisible" v-on:click="reverseDirections" fab dark small color="white" class="route-switch-button black--text">
      <v-icon dark>compare_arrows</v-icon>
    </v-btn>
    

  </div>
</div>
</template>

<script>
import MapNav from './MapNav.vue';
import {eventBus} from '../main.js';

import axios from 'axios'
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
      userLocation: Object,
      foursquareResponse: Object,
<<<<<<< HEAD
      isVisible: true,
      right: 13.5
=======
      foursquareSearch: String
>>>>>>> 5ab9031e1d4eb6a5debdded4f6590b8974e7fe59
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
<<<<<<< HEAD
    },
    showRouting: function() {
      this.isVisible = !this.isVisible;
      var destination = document.getElementsByClassName("mapbox-directions-destination")[0];
      var directionsProfile = document.getElementsByClassName("mapbox-directions-profile")[0];
      if (destination.style.display == "block") {
        destination.style.display = "none";
        directionsProfile.style.display = "none";
        this.directions.removeRoutes();
      } else {
        destination.style.display = "block";
        directionsProfile.style.display = "block";
      }
    },
    reverseDirections: function() {
      this.directions.reverse();
=======
>>>>>>> 5ab9031e1d4eb6a5debdded4f6590b8974e7fe59
    }
  },
  created(){
    eventBus.$on('toggleDirections', (isVisible) =>{
      console.log(isVisible)
      });
  },
  mounted(){
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
      accessToken: mapboxgl.accessToken
    }, 'bottom-left');

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

  this.marker = new mapboxgl.Marker({
    // element: this.$refs.custom-marker,     WENN CUSTOM MARKER EINGEFÜGT IST
    draggable: false
  })
    .setLngLat([this.long, this.lat])
    .addTo(this.mainMap);

  this.geocoder.on('result', this.updateMarker);

  var foursquareID = 'FPAOMYEFTC3B3L0SQKO0PTH0LAARK4NFYYZSVFRTVTAZA2NE';
  var foursquareSecret = 'XGQPJYTUJEVDSHF1PHCGH0M5HHEOEKLJIL1D1OR1FSEBSC5B';
  this.foursquareSearch = 'supermarket'
  axios
      .get('https://api.foursquare.com/v2/venues/search?client_id='+foursquareID+'&client_secret='+foursquareSecret+'&v=20180323&limit=5&ll=48.218800,11.624707&query='+this.foursquareSearch+'')
      .then(response => {
        this.foursquareResponse = response.data.response ;
        for(var i = 0; i< this.foursquareResponse.venues.length; i++){
          new mapboxgl.Marker({
            draggable: false
          })
          .setLngLat([this.foursquareResponse.venues[i].location.lng, this.foursquareResponse.venues[i].location.lat ])
          .addTo(this.mainMap);
        }
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => console.log('done'))
    
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

/* Map Navigation */

h3 {
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
  margin-top: -1rem;
}

#mapbox-directions-destination-input .mapboxgl-ctrl-geocoder span.geocoder-icon.geocoder-icon-search {
  display: none;
}

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
  right: -13.3rem;
  display: none;
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
  speak:none;
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
  // .geocoder-icon-loading {
  //   background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxwYXRoIGQ9Im0xMCAyIDAgMy4zYzIuNiAwIDQuNyAyLjEgNC43IDQuN2wzLjMgMGMwLTQuNC0zLjYtOC04LTh6IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTEwIDJDNi44IDIgMy43IDQuMSAyLjYgNy4xIDEuNCAxMCAyLjEgMTMuNiA0LjUgMTUuOGMyLjQgMi40IDYuNCAyLjkgOS40IDEuMiAyLjUtMS40IDQuMi00LjIgNC4yLTctMS4xIDAtMi4yIDAtMy4zIDAgMC4xIDIuMi0xLjcgNC4zLTMuOCA0LjZDOC43IDE1IDYuNCAxMy44IDUuNyAxMS43IDQuOCA5LjcgNS42IDcuMSA3LjYgNiA4LjMgNS42IDkuMSA1LjMgMTAgNS4zYzAtMS4xIDAtMi4yIDAtMy4zeiIgc3R5bGU9ImZpbGw6IzAwMDtvcGFjaXR5OjAuMiIvPjwvc3ZnPg==);
  //   -webkit-animation: rotate 400ms linear infinite;
  //      -moz-animation: rotate 400ms linear infinite;
  //       -ms-animation: rotate 400ms linear infinite;
  //           animation: rotate 400ms linear infinite;
  //   }


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
      max-height: 50vh;
      }
  .mapbox-directions-routes {
    margin-left: 5px;
    font-size:12px;
    float: right;
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


</style>
