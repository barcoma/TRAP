<template>
  <div class="createPOI-container">
    <div class="createPOI-top-area"></div>
    <h1 class="createPOI-headline">Orte Hinzufügen</h1>
    <p class="createPOI-first-instruction">Klicken Sie auf Hinzufügen um einen 
    <div id="map" ref="map"></div>
    <v-btn color="white" dark fab small class="POI-delete" v-on:click="deleteMarker()">
      <v-icon dark>delete_outline</v-icon>
    </v-btn>
    <v-btn color="white" dark fab small class="POI-createMarker" v-on:click="createMarker()">
      <v-icon dark>add_location</v-icon>
    </v-btn>
    <p class="POI-create" v-on:click="createPoi()">Hinzufügen</p>
    <div v-if="poiDescription" class="POI-desciption-container">
      <div class="POI-description">
        <input class="POI-name" type="text">
        <p class="POI-close" v-on:click="poiDescription = false">Abbrechen</p>
        <p class="POI-save" v-on:click="createPoi()">Speichern</p>
      </div>
    </div>
  </div>
</template>


<script>
import { eventBus } from '../main.js';
import mapboxgl from 'mapbox-gl'

export default {
  name: 'CreatePoi',
  data() {
    return {
      mainMap: Object,
      lat: Number,
      long: Number,
      marker: null,
      popup: Object,
      poiDescription: false
    };
  },
  created() {

  },
  methods: {
    deleteMarker: function() {
      this.marker.remove();
    },
    createMarker: function() {
      if (this.marker !== null) {
        this.marker.remove();
      }
      this.marker = new mapboxgl.Marker({
      draggable: true
      })
      .setLngLat([this.mainMap.getBounds().getCenter().lng, this.mainMap.getBounds().getCenter().lat])
      .setPopup(this.popup)
      .addTo(this.mainMap);
    },
    createPoi: function() {
      this.poiDescription = true;
      this.lat = this.marker.getLngLat().lat;
      this.long = this.marker.getLngLat().lng;
    }
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

    this.popup = new mapboxgl.Popup({ offset: 40, className: 'popup' })
      .setText('Ziehen sie den Marker an die gewünschte Stelle.');

    this.createMarker();
    this.marker.togglePopup()
    this.marker.on('dragstart', e => {
      this.popup.remove();
    })

  }
};
</script>

<style scoped lang="scss">


.createPOI-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 5% 30% 30% 30% 5%;
  grid-template-rows: 7% 77% 8% 8%;
  grid-template-areas: 
  ". . headline headline ."
  ". . . . ."
  ". . . . ."
  ". . deleteButton createButton .";
  #map {
    grid-column: 1 / 6;
    grid-row: 1 / 5;
  }
  .POI-create {
    grid-area: createButton;
    background: -moz-linear-gradient(45deg, rgba(50,234,255,1) 0%, rgba(40,115,214,1) 0%, rgba(182,125,232,1) 100%, rgba(32,124,202,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    padding: 0.5rem 0.9rem 0.5rem 0.9rem;
    border-radius: 50px;
    margin-bottom: 1rem;
    box-shadow: 2px 2px 10px black;
    color: white;
    z-index: 9;
    align-self: end;
    justify-self: center;
  }
  .POI-delete {
    grid-area: deleteButton;
    justify-self: start;
    align-self: center;
    // margin: 0 !important;
  }
  .createPOI-headline {
    grid-area: headline;
    justify-self: end;
    z-index: 10;
    align-self: center;
  }
  .createPOI-top-area {
    grid-column: 1 / 6;
    grid-row: 1;
    z-index: 9;
    background-color: rgba(0,0,0,0.7);
  }
  .POI-createMarker {
    grid-column: 3;
    grid-row: 4;
    justify-self: end;
    align-self: center;
    z-index: 9;
  }
  .POI-desciption-container {
    grid-column: 1 / 6;
    grid-row: 2 / 5;
    z-index: 9;
    background-color: rgba(0,0,0,0.7);
    
  }
  .POI-description {
      height: 90%;
      width: 90%;
      background-color: white;
      margin: auto;
      margin-top: 1rem;
      border-radius: 10px;
      display: grid;
      grid-template-columns: 5% 30% 30% 30% 5%;
      grid-template-rows: 7% 77% 8% 8%;
      grid-template-areas: 
      ". . . . ."
      ". . . . ."
      ". . . . ."
      ". closeButton . saveButton .";
      .POI-save {
        grid-area: saveButton;
        background: -moz-linear-gradient(45deg, rgba(50,234,255,1) 0%, rgba(40,115,214,1) 0%, rgba(182,125,232,1) 100%, rgba(32,124,202,1) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        padding: 0.5rem 0.9rem 0.5rem 0.9rem;
        border-radius: 50px;
        margin-bottom: 1rem;
        box-shadow: 2px 2px 10px black;
        color: white;
        z-index: 9;
        // align-self: end;
        // justify-self: end;
      }
      .POI-close {
        grid-area: closeButton;
        padding: 0.5rem 0.9rem 0.5rem 0.9rem;
        border-radius: 50px;
        margin-bottom: 1rem;
        box-shadow: 2px 2px 10px rgba(104, 104, 104, 0.774);
        color: black;
        z-index: 9;
        // align-self: end;
        // justify-self: end;
      }
    }
}

.theme--dark.v-btn {
    color: black !important;
}

</style>
<style>

.mapboxgl-popup-content {
  color: white;
  background: rgba(0,0,0, 0.8);
  border-radius: 10px;
}
.mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
  border-left-color: rgba(0,0,0, 0.8) !important;
}
.mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
  border-right-color: rgba(0,0,0, 0.8) !important;
}
.mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
  border-bottom-color: rgba(0,0,0, 0.8) !important;
}
.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
  border-top-color: rgba(0,0,0, 0.8) !important;
}
.mapboxgl-popup-close-button {
  padding-right: 0.4rem;
}

</style>
