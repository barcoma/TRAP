<template>
<v-app>
  <v-container >

    <v-layout align-center row wrap class="top-area">

      <v-flex xs3 mt-3>
         <v-icon large color="white">menu</v-icon>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs4 mt-3 class="flex-avatar">
        <v-avatar
          :size="64"
          color="grey lighten-4"
        >
          <img src="https://i1.rgstatic.net/ii/profile.image/390911189110788-1470211898704_Q512/Wolfgang_Taube2.jpg" alt="avatar">
        </v-avatar>
      </v-flex>
      <v-flex class="text-xs-left" xs12 offset-xs1>
        <h1>Hi, Wolfang!</h1>
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
            <!-- <v-text-field 
            class="main-input-autocomplete"
            id="testFeld"
            label="Solo"
            placeholder="Los geht's!"
            solo
            v-model="searchTerm"
            v-on:keyup="locationSearch()"
          > -->
          <v-autocomplete
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            @change="getDestination"
            color="white"
            hide-no-data
            hide-selected
            item-text="Description"
            item-value="API"
            placeholder="Los geht's!"
            return-object
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
        <mobile-nav>
          <hamburger
              :stroke='2'
              :gap='5'
              color='#192a35'
              :open.sync='open'>
          </hamburger>
      </mobile-nav>
      </div>
    </v-layout>

    <v-layout row>
      <carousel :paginationEnabled="false">
        <slide>
          <v-flex mr-1 ml-1>
          <v-card dark tile flat color="blue">
            <v-card-text>Reisetagebuch</v-card-text>
            <v-img src="https://picsum.photos/510/300?random" aspect-ratio="1.7"></v-img>
          </v-card>
          </v-flex>
        </slide>
        <slide>
          <v-flex mr-1 ml-1>
          <v-card dark tile flat color="blue">
            <v-card-text>Reisetagebuch</v-card-text>
            <v-img src="https://picsum.photos/510/300?random" aspect-ratio="1.7"></v-img>
          </v-card>
          </v-flex>
        </slide>
        <slide>
          <v-flex mr-1 ml-1>
          <v-card dark tile flat color="blue">
            <v-card-text>Reisetagebuch</v-card-text>
            <v-img src="https://picsum.photos/510/300?random" aspect-ratio="1.7"></v-img>
          </v-card>
          </v-flex>
        </slide>
      </carousel>
    </v-layout>
  </v-container>  
  </v-app>
</template>

<script>

import { Carousel, Slide } from 'vue-carousel';
import Hamburger from 'vue-hamburger';
import MobileNav from 'mobile-nav';

// import 'vue-hamburger/index.css'
// Vue.component('hamburger', require())
 
//Example Vue component using the hamburger
// Vue.component('mobile-nav', {
//   data: function() {
//     return {
//       open: false // The open/close state of the mobile nav
//     }
//   }
// })

  export default {
    components: {
      Carousel,
      Slide,
      Hamburger,
      MobileNav
    },
    data: function() {
    return {
      open: false // The open/close state of the mobile nav
    }
  }
    // data: () => ({
    //   // lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`,
    //   // date: new Date().toISOString().substr(0, 10), 
    //   // time: new Date().getHours() + ':' + new Date().getMinutes() 
    // })
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
    height: 25rem;
    background-image: linear-gradient(129deg, #4285f4, #00ebff);
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

</style>

