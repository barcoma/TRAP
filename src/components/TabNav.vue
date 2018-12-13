<template>
  <div class="tabnav-wrapper">
    <!-- <router-link to="/">Hier</router-link>
    <router-link to="/next">Home</router-link> -->
      <v-tabs
        slot="extension"
        fixed-tabs
        color="transparent"
        height="70%"
      >
        <v-tab to="/team">
          <v-icon color="blue" x-large>skip_next</v-icon>
        </v-tab>

        <v-tab to="/">
          <v-icon color="blue" x-large>home</v-icon>
        </v-tab>

        <v-tab to="/next">
          <v-icon color="blue" x-large>account_box</v-icon>
        </v-tab>
      </v-tabs>
    

  </div>
</template>

<script>
import {eventBus} from '../main.js';

  export default  {
    name: 'TabNav',
    props: [],
    data() {
      return {

      }
    },
    mounted() {
    },
    methods: {
        
    },
    computed: {
 
    }
}
</script>

<style lang="scss">

.tabnav-wrapper{
  height: 100%;
  overflow: hidden;
  -webkit-box-shadow: inset 0px 3px 8px -3px rgba(0,0,0,0.75);
  -moz-box-shadow: inset 0px 3px 8px -3px rgba(0,0,0,0.75);
  box-shadow: inset 0px 3px 8px -3px rgba(0,0,0,0.75);
}

.v-tabs .v-tabs__bar .v-tabs__bar{
  height: 100%;
}
</style>
