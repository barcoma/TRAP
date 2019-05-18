<template>
    <div class="POI-container">
        <h1 class="POI-headline">Orte finden</h1>
        <p class="POI-source">Von wo sollen die Daten stammen ?</p>
        <div class="bg source"></div>
        <p @click="yelp = !yelp" v-bind:class="{ active: yelp }" class="toggleButton yelp">Yelp</p>
        <p @click="foursquare = !foursquare" v-bind:class="{ active: foursquare }" class="toggleButton foursquare">Foursquare</p>
        <p @click="custom = !custom" v-bind:class="{ active: custom }" class="toggleButton custom">Eigene</p>
        <p class="POI-category">In welchen Kategorien soll gesucht werden ?</p>
         <div class="bg category"></div>
        <p @click="category.autorepair = !category.autorepair" v-bind:class="{ active: category.autorepair }" class="toggleButton autorepair">Werkstatt</p>
        <p @click="category.food = !category.food" v-bind:class="{ active: category.food }" class="toggleButton food">Restaurants</p>
        <p @click="category.hotels = !category.hotels" v-bind:class="{ active: category.hotels }" class="toggleButton hotels">Hotels</p>
        <p @click="category.servicestations = !category.servicestations" v-bind:class="{ active: category.servicestations }" class="toggleButton servicestations">Tankstelle</p>
        <p @click="category.physicians = !category.physicians" v-bind:class="{ active: category.physicians }" class="toggleButton physicians">Ärzte</p>
        <p class="POI-filter-search">Suche starten</p>
    </div>
</template>


<script>
import { eventBus } from '../main.js'

export default {
  name: 'PoiFilter',
  data() {
    return {
        yelp: true,
        foursquare: false,
        custom: false,
        category: {
            autorepair: true,
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
  }
};
</script>

<style scoped lang="scss">

* {
    color: white;
}

p {
    text-align: left;
    padding-left: 1rem;
    margin-bottom: 0;
}
.POI-container {
    background: linear-gradient(to bottom, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%);
    background-blend-mode: multiply;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 5% 30% 30% 30% 5%;
    grid-template-rows: 5% 5% 5% 5% 5% 5% auto;
    grid-row-gap: 5px;
    grid-template-areas: 
    "headline headline headline headline headline"
    ". POISource POISource POISource ."
    ". yelp foursquare custom ."
    ". category category category ."
    ". autorepair food hotels ."
    ". servicestations physicians . ."
    ". . search search .";

        .POI-headline {
            grid-area: headline;
            justify-self: start;
            align-self: end;
            grid-column: 4;
        }
        .POI-source {
            grid-area: POISource;
            color: white;
            align-self: center;
        }
        .bg {
            // background-color: rgba(0,0,0, 0.7);
            // background: rgb(0,0,0);
            // background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(51,51,51,1) 100%);
            background: rgb(19,19,19);
            background: linear-gradient(180deg, rgba(19,19,19,1) 0%, rgba(51,51,51,0.9164040616246498) 100%);
            border-radius: 50px;
            width: 98%;
            justify-self: center;
            box-shadow: 0px 0px 17px dimgrey;
        }
        .bg.source {
            grid-column: 2 / 5;
            grid-row: 3;
        }
        .bg.category {
            grid-column: 2 / 5;
            grid-row: 5 / 7;
            border-radius: 16px;
        }
        .toggleButton {
            // background: rgba(134, 134, 134, 0.507);
            // background: linear-gradient(0deg, rgba(134,134,134,1) 0%, rgba(85,85,85,1) 41%, rgba(0,0,0,1) 100%);
            color: white;
            padding: 0.5rem;
            border-radius: 50px;
            width: 90%;
            text-align: center;
            place-self: center;
        }
        .yelp {
            grid-area: yelp;
        }
        .foursquare {
            grid-area: foursquare;
        }
        .custom {
            grid-area: custom;
        }
        .POI-category {
            grid-area: category;
            align-self: center;
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
        .POI-filter-search {
            grid-area: search;
            align-self: end;
            justify-self: end;
            background-color: blue;
            padding: 0.5rem 0.9rem 0.5rem 0.9rem;
            border-radius: 50px;
            margin-bottom: 1rem;
        }
    }
    .active {
        background-color: dodgerblue !important;

    }

</style>
