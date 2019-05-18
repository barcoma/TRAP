<template lang="html">

  <v-layout row>

      <div>
        <v-tabs
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
  
</template>
 
<script lang="js">
import { Carousel, Slide } from 'vue-carousel';



  export default  {
    name: 'HomeSlider',
    props: [],
    components: {
      Carousel,
      Slide
    },
    mounted() {
      
    },
    data() {
      return {
        
      }
    },
    methods: {
    
    },
    computed: {
 
    }
}
</script>
 
<style lang="scss">

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