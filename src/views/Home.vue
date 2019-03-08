<template>
  <v-container fluid>
    <!-- <v-layout row mb-2>

      <v-flex xs12>
        <v-card dark tile flat color="blue">
          
            <v-layout row>
              <v-flex xs6>
                <v-card dark tile flat color="blue">
                  <v-card-text>Willkommen</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs5 offset-xs1>
                <v-card dark tile flat color="blue">
                  <v-card-text>{{ time }}<br>{{ date }}</v-card-text>
                </v-card>
              </v-flex>
            </v-layout>

            <v-card-text>Wetter</v-card-text>
        </v-card>
      </v-flex>
      
    </v-layout>

    <v-layout row>

        <v-flex xs6 mr-1>
          <v-card dark tile flat color="blue">
            <v-card-text>Reisetagebuch</v-card-text>
            <v-img src="https://picsum.photos/510/300?random" aspect-ratio="1.7"></v-img>
          </v-card>
        </v-flex>

        <v-flex xs6 ml-1>
          <v-card dark tile flat color="blue">
            <v-card-text>OBD</v-card-text>
            <v-icon large>fas fa-tools</v-icon>
          </v-card>
        </v-flex>

    </v-layout> -->

    <v-layout row>
      <carousel>
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
</template>

<script>

import { Carousel, Slide } from 'vue-carousel';

  export default {
    components: {
      Carousel,
      Slide
    },
    data: () => ({
      lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`,
      date: new Date().toISOString().substr(0, 10), 
      time: new Date().getHours() + ':' + new Date().getMinutes() 
    })
  }
</script>


<style lang="scss">

  .v-card {
    border-radius: 8px !important;
  }

  .d-flex {
    height: 10rem;
  }

.VueCarousel {
    width: 100%;
}

</style>

