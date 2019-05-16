<template lang="html">
    <section class="OBD">
        <v-toolbar extension-height class="topbar">
            
      </v-toolbar>
      <sidebarmenu class="sidebarmenu"/>
       
    
     <v-btn block round large color="green" dark><i class="material-icons">insert_emoticon</i>Alles gut <i class="material-icons">
keyboard_arrow_right
</i></v-btn>
   <v-btn block round large color="orange" dark><i class="material-icons">thumb_down</i>  <i class="material-icons" >
keyboard_arrow_right
</i></v-btn>

   <v-btn block round large color="red" dark><i class="material-icons">warning</i>Dringend Werkstatt aufsuchen<i class="material-icons" >
keyboard_arrow_right
</i></v-btn>
  <v-layout justify center>
        <v-flex xs12 sm6>

      <v-card>
        <v-container
          fluid
          grid-list-md
        >
          <v-layout row wrap>
            <v-flex
              v-for="card in cards"
              :key="card.title"
              v-bind="{ [`xs${card.flex}`]: true }"
            >
              <v-card>
                <v-img
                  :src="card.src"
                  height="200px"
                >
                  <v-container
                    fill-height
                    fluid
                    pa-2
                  >
                    <v-layout fill-height>
                      <v-flex xs12 align-end flexbox>
                        <span class="headline white--text" v-text="card.title"></span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-img>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
    </v-layout>
    </section>
</template>

<script>

import Sidebarmenu from '../components/Sidebarmenu.vue'

export default {
    name: "OBD",
    data: () => ({
      cards: [
        { title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 6 },
        { title: 'Best airlines', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 6 },
        { title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 6 },
        { title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 6 }
      ]
    }), 
    methods: {
        getDevices: function() {
            navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service']
            })
            .then(device => { 
                console.log(device.name);
                return device.gatt.connect();
            })
            .then(server => { /* ... */ })
            .catch(error => { console.log(error); });
        }
    
    },
    mounted() {
    // this.$http.get('http://192.168.0.10:35000').then(response => {

    // // get body data
    // this.someData = response.body;
    // console.log(someData);

  //}, response => {
    // error callback
  //});
},
    components:{
    Sidebarmenu
    },
}
</script>
<style lang="scss">

i.material-icons{
    margin: 0 15%;
}

.topbar{
    background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); 
    height:8%;
    width: 100%;
}
</style>