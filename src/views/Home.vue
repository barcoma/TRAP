<template>
<v-app>
  <v-container >

    <v-layout align-center row wrap class="top-area">

      
         <sidebarmenu class="sidebarmenu"/>
      
      <v-spacer></v-spacer>
      <v-flex xs4 mt-3 class="flex-avatar">
        <v-avatar
          :size="64"
          color="grey lighten-4"
        >
          <!-- <img src="https://i1.rgstatic.net/ii/profile.image/390911189110788-1470211898704_Q512/Wolfgang_Taube2.jpg" alt="avatar"> -->
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
        <p>Wilhemstraße 22</p>
        <p>Furtwangen im Schwarzwald</p>
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
                <v-icon v-on:click="locationSearch()">check</v-icon>
                <v-icon v-on:click="locationSearch2()">directions</v-icon>
            </template>
          </v-autocomplete>      
          </v-flex>

    </v-layout>

    <v-layout row>

      <div>
        <v-tabs
          v-model="active"
          color="white"
          light
          centered
          grow
          active-class="active-tab"
        >
          <v-tab href="#tab-1">
            Letzte Ziele
          </v-tab>
          <v-tab href="#tab-2">
            Favoriten
          </v-tab>
          <v-tab href="#tab-3">
            Entdecken
          </v-tab>
          <v-tab-item
                v-for="i in 3"
                :key="i"
                :value="'tab-' + i"
                touchless
                lazy
          >

            <carousel v-if="i == 1"
            :paginationEnabled="false"
            >
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="https://images.unsplash.com/photo-1436637706755-81d219b36e29?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Eifelturm</div>
                        <div class="carousel-tex-subheader">Paris, France</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="https://images.unsplash.com/photo-1486247496048-cc4ed929f7cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Louvre</div>
                        <div class="carousel-tex-subheader">Paris, France</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="https://picsum.photos/510/300?random"
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Wolfang</div>
                        <div class="carousel-tex-subheader">Paris, France</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
            </carousel>




            <carousel v-if="i == 2"
            :paginationEnabled="false"
            >
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="https://www.schwarzwald-geniessen.de/eip/clips/lightbox_eingang.jpg?fl=18139758"
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Uhrenmuseum</div>
                        <div class="carousel-tex-subheader">Furtwangen, Germany</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="https://www.schwarzwald-geniessen.de/eip/clips/lightbox_eingang.jpg?fl=18139758"
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Kebab-Treff</div>
                        <div class="carousel-tex-subheader">Furtwangen, Germany</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
              <slide>
                <v-flex mr-1 ml-1>
                  <v-card dark tile flat
                  img="https://picsum.photos/510/300?random"
                  height="30vh"
                  >        
                    <v-card-title>
                      <v-icon medium>location_on</v-icon>
                      <div class="carousel-text">
                        <div class="carousel-tex-headline">Wolfang</div>
                        <div class="carousel-tex-subheader">Paris, France</div>
                      </div>
                    </v-card-title>                
                  </v-card>
                </v-flex>
              </slide>
            </carousel>

          </v-tab-item>
        </v-tabs>
      </div>
    </v-layout>
  </v-container>  
  </v-app>
</template>

<script>

import { Carousel, Slide } from 'vue-carousel';
import {eventBus} from '../main.js';

import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from 'mapbox-gl-geocoder'
import Sidebarmenu from '../components/Sidebarmenu.vue'


  export default {
    components: {
      Carousel,
      Slide,
      Sidebarmenu
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
      newDestination: Object
    }),
    methods: {
      locationSearch: function(event){
        //console.log('FUCK',this.newDestination);
        // this.$router.push('map');
        // eventBus.$emit('LocationFromHome', this.searchTerm);
        },
        locationSearch2: function(){
         // console.log('CUNT')
        },
        getDestination: function(event){
          this.newDestination = event.geometry.coordinates;
          //console.log('CHANGE INPUT', this.newDestination)
        }
      },

    computed: {
      items () {
        return this.entries.map(entry => {
          if(entry.relevance > .5){
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
          console.log('items()', this.items)
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

  .v-card {
    border-radius: 8px !important;
  }
  .d-flex {
    height: 10rem;
  }

  .v-tabs, .v-tabs__bar{
    margin-bottom: 2rem;
    font-family: 'Roboto Slab', serif;
  }

  a{
    text-transform: none !important;
  }

  .active-tab{
    font-weight: 800;
    border-bottom: 5px solid #ffc400;
  }

.VueCarousel {
    width: 100%;
}

.carousel-text{
  font-family: 'Roboto Slab', serif;
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

</style>