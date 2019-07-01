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
        <h1>Hi, {{ username }}</h1>
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
                <v-icon v-on:click="locationSearch()">directions</v-icon>
            </template>
          </v-autocomplete>      
          </v-flex>

    </v-layout>

    <div class="last-destinations-container">
      <div v-if="weather" class="weather-container">
        <h3 class="weather-location">{{ currentLocation }}</h3>
        <p class="weather-temp"><span class="weather-temp-current">{{ temp }}&deg;C</span><br>{{ temp_max }}&deg;C / {{ temp_min }}&deg;C</p>
        <!-- <div v-if="weather.weatherIcon != ''" class="weather-icon-container"><img :src="weatherIcon" class="weather-icon" alt="Weather icon"></div> -->
        <div v-if="weather.weatherIcon != ''" class="weather-icon-container"><i :class="weatherIcon" class="weather-icon"></i></div>
      </div>
      <div v-else>
        <p>Wetter konnte nicht geladen werden</p>
      </div>
      <h3 class="last-destinations">Letzte Ziele</h3>
      <ul class="last-locations-list">
        <li v-for="destination in lastDestination" :key="destination.id">
          <v-icon color="white">near_me</v-icon> {{ destination.name }}
        </li>
      </ul>
      <hr class="spacer"/>
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
import Sidebarmenu from '../components/Sidebarmenu.vue'
import { weather, getLastDestination } from '../shared_data/queries'

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
      currentLocation: weather.location,
      weather: true,
      weatherIcon: weather.weatherIcon,
      temp: weather.temp,
      temp_max: weather.temp_max,
      temp_min: weather.temp_min,
      username: '',
      lastDestination: [{
        "name": "Keine letzten Ziele gefunden!",
        id: 0
      }]
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
          axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=fe3cea1e7566ca588e162814917a216f&units=metric`).then(response => {
              this.weather = true;
              this.currentLocation = response.data.name;
              // this.weatherIcon = 'https://openweathermap.org/img/w/' + response.data.weather[0].icon + '.png';
              this.weatherIcon = 'owi owi-' +  response.data.weather[0].icon;
              this.temp = Math.round(response.data.main.temp);
              this.temp_max = Math.round(response.data.main.temp_max);
              this.temp_min = Math.round(response.data.main.temp_min);
              // var weatherIcon = 'https://openweathermap.org/img/w/' + response.data.weather[0].icon + '.png';
              var weatherIcon = 'owi owi-' +  response.data.weather[0].icon;
              var temp = Math.round(response.data.main.temp);
              var temp_max = Math.round(response.data.main.temp_max);
              var temp_min = Math.round(response.data.main.temp_min);
              weather.updateWeatherData(response.data.name, weatherIcon, temp, temp_max, temp_min);
              console.log(response.data);
            }, error => {
              this.weather = false;
              console.log("Weater API error");
            })
        }
      },
    created() {
      eventBus.$on('updateName', () => {
        this.username = this.$cookie.get('Username');
      })
    },
    mounted() {
      if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
          this.getWeather(position)
        }, (error) => {
          console.log("location error");
        }
      )
    } else console.log("Your browser does not support me.")
      this.$apollo.query({
        query: getLastDestination
      }).then(response => {
        console.log(response);
        if(response.data) {
          this.lastDestination = response.data.lastDestination;
        }
      })

      this.username = this.$cookie.get('Username');
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

h1, h2, h3, h4 {
  color: white;
}
h3 {
  font-weight: 400;
}

.container {
  padding: 0 !important;
  overflow: scroll;
  max-width: 900px !important;
}


.top-area {
  height: 20rem;
  margin-bottom: 1rem;
  border-bottom-left-radius: 7%;
  border-bottom-right-radius: 7%;
  // background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
  // background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
  // background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  background: #00d2ff;  /* fallback for old browsers */
  background: -webkit-linear-gradient(#3a7bd5, #00d2ff);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(#3a7bd5, #00d2ff); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  .flex-avatar {
    img {
      border: 3px solid rgb(255, 255, 255);
    }
  }
}

.main-input-autocomplete:after {
  top: 100%;
  left: 50%;
  border: solid transparent;
  content: " ";
  height: 50px;
  width: 50px;
  position: absolute;
  pointer-events: none;
}

.v-input__slot {
  border-radius: 10px !important; 
}

.location {
  p {
    margin-bottom: 0;
    color:rgba(255, 255, 255, 0.75);
    font-size: .75rem;
    line-height: 1rem;
  }
}

.v-card {
  border-radius: 8px !important;
}
.d-flex {
  height: 10rem;
}

.v-tabs, .v-tabs__bar {
  margin-bottom: 2rem;
}

a {
  text-transform: none !important;
}

.active-tab {
  font-weight: 800;
  border-bottom: 5px solid #ffc400;
}

.VueCarousel {
  width: 100%;
}

.carousel-text{
  .carousel-tex-headline{
    font-size: 1rem;
  }
  .carousel-tex-subheader{
    font-size: .75rem
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
  background-color: rgba(0,0,0, 0.4);
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


.last-locations-list {
  margin-left: 1rem;
  margin-right: 1rem;
  padding-left: 0;
  li {
    background-color: rgba(0,0,0, 0.4);
    border-radius: 17px;
    margin-bottom: 0.2rem;
    margin-top: 0.2rem;
    padding: 2rem;
    list-style: none;
    color: white;
  }
}

.last-destinations {
  color: white;
  text-align: left;
  padding-left: 2rem;
  padding-top: 1rem;
}

hr.spacer {
  height: 16rem;
  opacity: 0;
}

.last-destinations-container {
  // background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
  // background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
  // background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  background: #00d2ff;  /* fallback for old browsers */
  background: -webkit-linear-gradient(#00d2ff, #8E54E9);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(#00d2ff, #8E54E9); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border-radisu: 17px;
  border-radius: 22px;
  margin-top: 1rem;
  padding-top: 1rem;
}

.app-nav .v-card {
  border-radius: 0px !important;
}

@media (min-width: 900px) {
 .burger.theme--dark.v-btn {
    color: black !important;
  }
}

.weather-icon {
  font-size: 24pt;
  color: white;
}

</style>