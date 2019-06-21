<template>
    <div class="POI-container">
        <h1 class="POI-headline">Orte finden</h1>
        <p class="POI-source">Von wo sollen die Daten stammen?</p>
        <div class="bg source"></div>
        <p @click="source.yelp = !source.yelp; getAmount()" v-bind:class="{ active: source.yelp }" class="toggleButton yelp">Yelp</p>
        <p @click="source.foursquare = !source.foursquare; getAmount()" v-bind:class="{ active: source.foursquare }" class="toggleButton foursquare">Foursquare</p>
        <p @click="source.custom = !source.custom; getAmount()" v-bind:class="{ active: source.custom }" class="toggleButton custom">Eigene</p>
        <p class="POI-category">In welchen Kategorien soll gesucht werden?</p>
         <div class="bg category"></div>
        <p @click="category.autorepair = !category.autorepair; getAmount()" v-bind:class="{ active: category.autorepair }" class="toggleButton autorepair">Werkstatt</p>
        <p @click="category.food = !category.food; getAmount()" v-bind:class="{ active: category.food }" class="toggleButton food">Restaurants</p>
        <p @click="category.hotels = !category.hotels; getAmount()" v-bind:class="{ active: category.hotels }" class="toggleButton hotels">Hotels</p>
        <p @click="category.servicestations = !category.servicestations; getAmount()" v-bind:class="{ active: category.servicestations }" class="toggleButton servicestations">Tankstelle</p>
        <p @click="category.physicians = !category.physicians; getAmount()" v-bind:class="{ active: category.physicians }" class="toggleButton physicians">Ärzte</p>
        
        <p class="POI-slider-text">Wie viele Orte sollen maximal angezeigt werden?</p>
        <div class="POI-slider">
            <input class="slider-input" type="range" min="0" max="50" step="1.0">
            <p class="slider-value">Anzahl: <span id="demo"></span></p>
        </div>
        <div>
            Es gibt mindestens {{amount.yelpAmount + amount.foursquareAmount}} Treffer mit deinen Einstellungen!
        </div>
        <button class="POI-filter-search" v-on:click="startSearch" :to="{ name: 'map'}">Suche starten</button>
    </div>
</template>


<script>
import { eventBus } from '../main.js'
import gql from 'graphql-tag'
import { poiFilterQuery, amountQueries, coordinateQuery, toggleNaviPoi, updatePoiFilter } from  '../shared_data/queries'
import { getCategories } from '../shared_data/data'

export default {
  name: 'PoiFilter',
  data() {
    return {
        sliderValue: 50,
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
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        amount: {
            yelpAmount: 0,
            foursquareAmount: 0,
            customAmount: 0
        }
    };
  },
  created() {
  },
  methods: {
      startSearch: function() {
        const category = this.category;
        const source = this.source;

        this.$apollo.mutate({
            mutation: updatePoiFilter,
            variables: { category, source }
        })
        var defaultValues = true;
        for (var key in this.source) {
            if (key == false) {
                defaultValues = false;
            }
        }
        for (var key in this.category) {
            if (key == true) {
                defaultValues = false;
            }
        }
        if (!defaultValues) {
            toggleNaviPoi.toggleActive();
        }
        toggleNaviPoi.showPOI();
        this.$router.push('map');
      },
      resetFilter: function() {
        for (var key in this.source) {
            key = true;
        }
        for (var key in this.category) {
            key = false;
        }

        const category = this.category;
        const source = this.source;

        this.$apollo.mutate({
            mutation: updatePoiFilter,
            variables: { category, source }
        })
      },
      getAmount: function() {
        var categories = getCategories(this.category);
        var variables = {
            longitude: this.coordinates.longitude,
            latitude: this.coordinates.latitude,
            radius: 40000,
            yelpCategories: categories.yelpCategories,
            foursquareCategories: categories.foursquareCategories
        };
        this.executeAmountQuery(variables);
      },
      getQuery() {
        var source = this.source;
        var query;
        if (source.yelp) {
            if (source.foursquare) {
                if (source.custom) {
                    query = amountQueries.ALL_QUERY;
                } else {
                    query = amountQueries.FS_YELP_QUERY;
                }
            } else if (source.custom) {
                query = amountQueries.CUSTOM_YELP_QUERY;
            } else {
                query = amountQueries.YELP_ONLY_QUERY;
            }
        } else if (source.foursquare) {
            if (source.custom) {
                query = amountQueries.FS_CUSTOM_QUERY;
            } else {
                query = amountQueries.FS_ONLY_QUERY;
            }
        } else if (source.custom) {
            query = amountQueries.CUSTOM_ONLY_QUERY;
        }
        return query;
      },
      executeAmountQuery(variables) {
        var query = this.getQuery();
        this.$apollo.query({
            query: query,
            variables: variables
        }).then((response) => {
            var amount = response.data.getAmount;
            if (amount.yelpAmount != undefined) {
                this.amount.yelpAmount = amount.yelpAmount;
            } else {
                this.amount.yelpAmount = 0;
            }
            if (amount.foursquareAmount != undefined) {
                this.amount.foursquareAmount = amount.foursquareAmount;
            } else {
                this.amount.foursquareAmount = 0;
            }
            if (amount.customAmount != undefined) {
                this.amount.customAmount = amount.customAmount;
            } else {
                this.amount.customAmount = 0;
            }
        }).catch(error => {
            console.log(error);
        })
      }
  },
  mounted() {
    try {
        const coordinatesResponse = this.$apollo.provider.defaultClient.readQuery({
            query: gql` query coordinateQuery {
                coordinateQuery @client {
                    latitude
                    longitude
                }
            }`
        });
        this.coordinates = {
            latitude: coordinatesResponse.coordinateQuery.latitude,
            longitude: coordinatesResponse.coordinateQuery.longitude
        };
        var categories = getCategories(this.category);
        var variables = {
            longitude: this.coordinates.longitude,
            latitude: this.coordinates.latitude,
            radius: 40000,
            yelpCategories: categories.yelpCategories,
            foursquareCategories: categories.foursquareCategories
        };
        this.executeAmountQuery(variables);
    } catch (exception) {
        console.log(exception)
    }

    try {
        const filterParams = this.$apollo.provider.defaultClient.readQuery({
            query: poiFilterQuery
        });
        this.source = filterParams.poiFilter.source;
        this.category = filterParams.poiFilter.category;
    } catch (exception) {}

    var slider = document.getElementsByClassName("slider-input")[0];
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;

    slider.oninput = function() {
        output.innerHTML = this.value;
    }

    eventBus.$on("deleteFilter", e => {
        this.resetFilter();
    });
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
