<template lang="html">

 <div class="lastdestgrid">
    <div class="lastdesttop">
      <v-toolbar  class="topbar2">
          <h5>Letzte Ziele </h5>
      </v-toolbar>
       
     </div>
     
     <div class="lastdestmid">
     <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      
      
        <v-list two-line>
          <v-list-tile
            v-for="item in items"
            :key="item.title"
            title
            @click="map"
          >

          <v-list-tile-content >
              <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile-content>

           <v-icon>close</v-icon>

          </v-list-tile>
        </v-list>
    </v-flex>
  </v-layout>
  </div>
</div>
      
      
  
</template>

<script>

import Sidebarmenu from '../components/Sidebarmenu.vue'


export default {
    name: "lastdest",
     data () {
    return {
      items: [
        { title: 'Paris', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
        { title: 'New York', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
        { title: 'San Francisco', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
        { title: 'Freiburg', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' }
      ]}},
       
    components:{
    Sidebarmenu
    },
} 
</script> 
<style lang="scss">

.lastdestgrid{
    display: grid;
    grid-template-rows: 15% 70% 15%;
    height:100%;
    color:black;
}
.lastdesttop{
   grid-row-start: 1;
   grid-row-end:2;
   height:100%;
}
.lastdestmid{
grid-row-start: 2;
grid-row-end:3;
color:black;
}
div.v-list__tile__title{
    color:black !important;
    
}

.topbar2{
    background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); 
    height:100%;
    width: 100%;
    opacity:1;
}
</style>
