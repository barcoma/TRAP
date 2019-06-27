<template>
<v-app>
  <v-container>

    <v-layout align-center row wrap class="top-area">
      
      <v-spacer></v-spacer>
      <v-flex xs4 mt-3 class="flex-avatar">
        <v-avatar
          :size="64"
          color="grey lighten-4"
        >
        <v-icon large color="darkgrey">person</v-icon>
        </v-avatar>
      </v-flex>
      <v-flex class="text-xs-left" xs12 offset-xs1>
        <h1>Hi, Lisa!</h1>
        <h3>Wo soll deine Reise hingehen?</h3>
      </v-flex>

     <v-layout mt-0 mb-0 align-center class="location">
      <v-flex class="text-xs-left" xs1 offset-xs1>
        <v-icon medium>location_on</v-icon>
      </v-flex>

      <v-flex class="text-xs-left" xs10>
        <p>{{ currentLocation }}</p>
      </v-flex>
     </v-layout>

      <v-flex mt-1 xs10 offset-xs1>
          <v-autocomplete
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            :filter="v => v"
            @change="getDestination"
            item-text="place_name_de"
            item-value="id"
            placeholder="Los geht's!"
            solo
          >
            <template slot="append">
                <!-- <v-icon v-on:click="locationSearch()">check</v-icon> -->
                <v-icon v-on:click="locationSearch()">directions</v-icon>
            </template>
          </v-autocomplete>      
          </v-flex>
    </v-layout>
    <div v-if="weather" class="weather-container">
      <h3 class="weather-location">{{ currentLocation }}</h3>
      <p class="weather-temp"><span class="weather-temp-current">{{ temp }}&deg;C</span><br>{{ temp_max }}&deg;C / {{ temp_min }}&deg;C</p>
      <!-- <p>Regen: {{ rain }}%</p> -->
      <div class="weather-icon-container"><img :src="weatherIcon" class="weather-icon" alt="Weather icon"></div>
    </div>
    <div v-else>
      <p>Wetter konnte nicht geladen werden</p>
    </div>
   
  </v-container>  
  </v-app>
</template>

<script>
import {eventBus} from '../main.js';

import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from 'mapbox-gl-geocoder'
import HomeSlider from '../components/HomeSlider.vue'


  export default {
    components: {
      HomeSlider
    },
    data: () => ({
      lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`,
      date: new Date().toISOString().substr(0, 10), 
      time: new Date().getHours() + ':' + new Date().getMinutes(),
      active: null,
      searchTerm: '',
      entries: [],
      isLoading: false,
      model: null,
      search: null,
      newDestination: Object,
      newDestName: '',
      currentLocation: '',
      weather: true,
      weatherIcon: '',
      temp: '',
      temp_max: '',
      temp_min: '',
      rain: ''
    }),
    methods: {
      locationSearch: function(event){ 
        this.$router.push('map');
        var newDest = this.newDestination
        var newDestName = this.newDestName;
        setTimeout(function(){
          eventBus.$emit('locationFromHome', newDest, newDestName); 
        }, 4000);
        },
        locationSearch2: function(){
         // console.log('B')
        },
        getDestination: function(event){
          this.items.map(item => {
          if(item.id == event){
          this.newDestination = item.geometry.coordinates;
          this.newDestName = item.place_name_de;
          }});
        },
        getLocation: function() {
          navigator.geolocation.getCurrentPosition(function(location) {
            let lat = location.coords.latitude;
            let long = location.coords.longitude;

          })
        },
        getWeather: function(position) {
          let lat = position.coords.latitude
          let lon = position.coords.longitude
          axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=fe3cea1e7566ca588e162814917a216f&units=metric`).then(response => {
              this.weather = true;
              this.weatherIcon = 'http://openweathermap.org/img/w/' + response.data.weather[0].icon + '.png';
              this.currentLocation = response.data.name;
              this.temp = Math.round(response.data.main.temp);
              this.temp_max = Math.round(response.data.main.temp_max);
              this.temp_min = Math.round(response.data.main.temp_min);
              // this.rain = response.data.clouds.all;
              console.log(response);
            }, error => {
              this.weather = false;
              console.log("Weater API error");
            })
        }
      },
    beforeCreate() {
      if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
          this.getWeather(position)
          // this.startClock()
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
        }, (error) => {
          console.log("location error");
        }
      )
    } else console.log("Your browser does not support me.")
    },
    mounted() {
    
    },
    computed: {
      items () {
        return this.entries.map(entry => {
          if(entry.relevance > .1){
          return  Object.assign({}, entry);
          }
        })
      }
    },
    watch: {
      search (val) {
        this.searchTerm = val;

        if (this.isLoading) return

        this.isLoading = true
        var apiKey = 'pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjanQ3MWRtdTgwa3hkM3lvY3BydHd6ZG9pIn0.2Ag8iKmmWCGR3BjlPW4qEw';        
        var url = new URL("https://api.mapbox.com/geocoding/v5/mapbox.places/"+val+".json"),
                  params = {
                    access_token: apiKey,
                    language: 'de',
                    limit: 10,
                    autocomplete: true,
                    fuzzyMatch: true
                  }

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        
        fetch(url)
        .then(res => res.json())
        .then(res => {
          var newProps = { 
            count: res.features.length,
            entries: res.features
          }
          const { count, entries } = newProps
          this.count = count
          this.entries = entries
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => (this.isLoading = false))
      }
    }
  }
</script>


<style lang="scss">
  h1,h2,h3,h4 p {
    color: white;
    font-family: 'Roboto Slab', serif;
  }
  h3{
    font-weight: 400;
  }

  .container {
    padding: 0 !important;
  }

  .top-area {

    height: 20rem;

    margin-bottom: 1rem;
    border-bottom-left-radius: 7%;
    border-bottom-right-radius: 7%;
    background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */

    .flex-avatar{
      img {
        border: 3px solid rgb(255, 255, 255);
      }
    }
  }

  .main-input-autocomplete:after{
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 50px;
    width: 50px;
    position: absolute;
    pointer-events: none;
  }

  .v-input__slot{
    border-radius: 10px !important; 
  }

  .location{
    p{
      margin-bottom: 0;
      color:rgba(255, 255, 255, 0.75);
      font-size: .75rem;
      line-height: 1rem;
    }
  }


.v-list__tile__title, .theme--light.v-list .v-list__tile__mask{
  color: black !important;
  background: none !important;
  font-size: 1rem !important;
}

.weather-container {
  p {
    color: white;
    margin-bottom: 0;
  }
  background-color: rgba(0,0,0, 0.6);
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 16px;
  height: 8rem;
  display: grid;
  grid-template-columns: 5% 10% 50% 30% 5%;
   grid-template-areas: 
  ". weatherIcon weatherLocation weatherTemp .";
  .weather-location {
    grid-area: weatherLocation;
    align-self: center;
  }
  .weather-icon-container {
    grid-area: weatherIcon;
    align-self: center;
  }
  .weather-temp {
    grid-area: weatherTemp;
    line-height: 1.1;
    align-self: center;
    .weather-temp-current {
      font-size: 25pt;
    }
  }
}



</style>