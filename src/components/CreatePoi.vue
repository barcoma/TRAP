<template>
  <div class="createPOI-container">
    <div class="createPOI-top-area"></div>
    <h1 class="createPOI-headline">Orte Hinzufügen</h1>
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
        <h1 class="POI-description-headline">Informationen eingeben</h1>
        <input class="POI-name" type="text" placeholder="Ortsname" v-model="name">
        <textarea class="POI-description" placeholder="Ortsbeschreibung" v-model="description"></textarea>
        <p class="POI-category">Zur welchen Kategorien passt dieser Ort?</p>
        <div class="bg category"></div>
        <p @click="category.autorepair = !category.autorepair" v-bind:class="{ active: category.autorepair }" class="toggleButton autorepair">Werkstatt</p>
        <p @click="category.food = !category.food" v-bind:class="{ active: category.food }" class="toggleButton food">Restaurants</p>
        <p @click="category.hotels = !category.hotels" v-bind:class="{ active: category.hotels }" class="toggleButton hotels">Hotels</p>
        <p @click="category.servicestations = !category.servicestations" v-bind:class="{ active: category.servicestations }" class="toggleButton servicestations">Tankstelle</p>
        <p @click="category.physicians = !category.physicians" v-bind:class="{ active: category.physicians }" class="toggleButton physicians">Ärzte</p>
        <p class="POI-close" v-on:click="poiDescription = false">Abbrechen</p>
        <p class="POI-save" v-on:click="savePoi()">Speichern</p>
      </div>
    </div>
  </div>
</template>


<script>
import { eventBus } from '../main.js';
import mapboxgl from 'mapbox-gl'
import { createPOIMutation } from '../shared_data/queries'
 
export default {
  name: 'CreatePoi',
  data() {
    return {
      mainMap: Object,
      lat: Number,
      long: Number,
      marker: null,
      popup: Object,
      poiDescription: false,
      name: '',
      description: '',
      category: {
        autorepair: false,
        food: false,
        hotels: false,
        servicestations: false,
        physicians: false
      }
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
    },
    savePoi: function() {
      var category = this.category;
      var keys = Object.keys(category);
      var filteredKeys = keys.filter(function(key) {
          return category[key];
      });

      var variables = {
        latitude: this.lat,
        longitude: this.long,
        name: this.name,
        description: this.description,
        tags: filteredKeys
      }
      this.$apollo.mutate({
        mutation: createPOIMutation,
        variables: variables
      });
      this.poiDescription = false;
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

p {
  margin-bottom: 0;
}

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
      background: linear-gradient(to bottom, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%);
      background-blend-mode: multiply;
      margin: auto;
      margin-top: 1rem;
      border-radius: 10px;
      display: grid;
      grid-template-columns: 5% 30% 30% 30% 5%;
      grid-template-rows: 7% 8% 16% 6% 6% 6% 43% 8%;
      grid-template-areas: 
      ". DesHeadline DesHeadline DesHeadline ."
      ". name name name ."
      ". description description description ."
      ". category category category ."
      ". autorepair food hotels ."
      ". servicestations physicians . ."
      ". . . . ."
      ". closeButton . saveButton .";
      .POI-name {
        grid-area: name;
        height: 2rem;
        padding-top: 1.3rem;
        padding-bottom: 1.3rem;
        border-radius: 50px;
      }
      .POI-description {
        grid-area: description;
        margin: 0;
        width: 100%;
        border-radius: 17px;
        padding-top: 0.5rem;
      }
      .POI-name, .POI-description {
        // border: 1px solid grey;
        font-size: 14px !important;
        padding-left: 1rem;
        color: white !important;
        background: rgb(19,19,19);
        background: linear-gradient(180deg, rgba(19,19,19,1) 0%, rgba(51,51,51,0.9164040616246498) 100%);
        box-shadow: 0px 0px 17px dimgrey;
      }::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: white;
        opacity: 1; /* Firefox */
      }
      :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: white;
      }
      ::-ms-input-placeholder { /* Microsoft Edge */
        color: white;
      }
      .toggleButton {
        color: white;
        padding: 0.5rem;
        border-radius: 50px;
        width: 90%;
        text-align: center;
        place-self: center;
        }
      .bg {
        background: rgb(19,19,19);
        background: linear-gradient(180deg, rgba(19,19,19,1) 0%, rgba(51,51,51,0.9164040616246498) 100%);
        border-radius: 50px;
        width: 98%;
        justify-self: center;
        box-shadow: 0px 0px 17px dimgrey;
      }
      .bg.category {
        grid-column: 2 / 5;
        grid-row: 5 / 7;
        border-radius: 16px;
      }
      .POI-category {
        grid-area: category;
        align-self: center;
        justify-self: start;
        margin-left: 0.5rem;
        color: white;
      }
      .autorepair {
        grid-area: autorepair;
      }
      .food {
        grid-area: food;
      }
      .hotels {
        grid-area: hotels;
      }
      .servicestations {
        grid-area: servicestations;
      }
      .physicians {
        grid-area: physicians;
      }
      .POI-description-headline {
        grid-area: DesHeadline;
        color: white;
        justify-self: start;
        align-self: center;
      }
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
        background-color: white;
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
