<template>
    <div class="POI-container">
        <h1 class="POI-headline">Orte finden</h1>
        <p class="POI-source">Von wo sollen die Daten stammen?</p>
        <div class="bg source"></div>
        <p @click="source.yelp = !source.yelp" v-bind:class="{ active: source.yelp }" class="toggleButton yelp">Yelp</p>
        <p @click="source.foursquare = !source.foursquare" v-bind:class="{ active: source.foursquare }" class="toggleButton foursquare">Foursquare</p>
        <p @click="source.custom = !source.custom" v-bind:class="{ active: source.custom }" class="toggleButton custom">Eigene</p>
        <p class="POI-category">In welchen Kategorien soll gesucht werden?</p>
         <div class="bg category"></div>
        <p @click="category.autorepair = !category.autorepair" v-bind:class="{ active: category.autorepair }" class="toggleButton autorepair">Werkstatt</p>
        <p @click="category.food = !category.food" v-bind:class="{ active: category.food }" class="toggleButton food">Restaurants</p>
        <p @click="category.hotels = !category.hotels" v-bind:class="{ active: category.hotels }" class="toggleButton hotels">Hotels</p>
        <p @click="category.servicestations = !category.servicestations" v-bind:class="{ active: category.servicestations }" class="toggleButton servicestations">Tankstelle</p>
        <p @click="category.physicians = !category.physicians" v-bind:class="{ active: category.physicians }" class="toggleButton physicians">Ärzte</p>
        
        <p class="POI-slider-text">Wie viele Orte sollen maximal angezeigt werden?</p>
        <div class="POI-slider">
            <input class="slider-input" type="range" min="0" max="50" step="1.0">
            <p class="slider-value">Anzahl: <span id="demo"></span></p>
            <!-- <p>{{ sliderValue }}</p> -->
        </div>
        <p class="POI-filter-search" :to="{ name: 'map'}">Suche starten</p>
    </div>
</template>


<script>
import { eventBus } from '../main.js'

export default {
  name: 'PoiFilter',
  data() {
    return {
        sliderValue: 50,
        source: {
            yelp: true,
            foursquare: false,
            custom: false
        },
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
  },
  mounted() {
    var slider = document.getElementsByClassName("slider-input")[0];
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;

    slider.oninput = function() {
        output.innerHTML = this.value;
        // this.sliderValue = this.value; // Did not work
    }
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
    grid-template-rows: 5% 5% 5% 5% 5% 5% 5% 5% auto;
    grid-row-gap: 5px;
    grid-template-areas: 
    "headline headline headline headline headline"
    ". POISource POISource POISource ."
    ". yelp foursquare custom ."
    ". category category category ."
    ". autorepair food hotels ."
    ". servicestations physicians . ."
    ". slider-text slider-text slider-text ."
    ". slider slider slider ."
    ". . search search .";

        .POI-headline {
            grid-area: headline;
            justify-self: start;
            align-self: end;
            grid-column: 4;
        }
        .POI-slider {
            grid-area: slider;
            align-self: center;
            justify-self: center;
            width: 95%;
            .slider-input {
                -webkit-appearance: none;  /* Override default CSS styles */
                appearance: none;
                width: 100%; /* Full-width */
                height: 6px;
                border-radius: 50px;
                background: white; /* Grey background */
                outline: none; /* Remove outline */
                opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
                -webkit-transition: .2s; /* 0.2 seconds transition on hover */
                transition: opacity .2s;
            }
            .slider-input::-webkit-slider-thumb {
                -webkit-appearance: none; /* Override default look */
                appearance: none;
                width: 25px; /* Set a specific slider handle width */
                height: 25px; /* Slider handle height */
                border-radius: 50px;
                background: dodgerblue; /* Green background */
                cursor: pointer; /* Cursor on hover */
                box-shadow: 1px 1px 5px black;
            }
            .slider-input::-moz-range-thumb {
                width: 25px; /* Set a specific slider handle width */
                height: 25px; /* Slider handle height */
                background: dodgerblue; /* Green background */
                cursor: pointer; /* Cursor on hover */
            }
            .slider-input:hover {
                opacity: 1;
            }
            .slider-value {
                padding: 0.5rem;
            // border-radius: 50px;
            // background-color: dodgerblue;
            }
        }
        .POI-slider-text {
            grid-area: slider-text;
            align-self: center;
        }
        .POI-source {
            grid-area: POISource;
            color: white;
            align-self: center;
        }
        .bg {
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
            background: -moz-linear-gradient(45deg, rgba(50,234,255,1) 0%, rgba(40,115,214,1) 0%, rgba(182,125,232,1) 100%, rgba(32,124,202,1) 100%); /* FF3.6-15 */
            background: -webkit-linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%); /* Chrome10-25,Safari5.1-6 */
            background: linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
            padding: 0.5rem 0.9rem 0.5rem 0.9rem;
            border-radius: 50px;
            margin-bottom: 1rem;
            box-shadow: 2px 2px 10px black;
        }
    }
    .active {
        background-color: dodgerblue !important;

    }

</style>
