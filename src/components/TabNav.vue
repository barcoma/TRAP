<template>
  <v-card  height="100%" flat>
    <v-bottom-nav
      :value="true"
      absolute
      color="transparent"
      class="tabnav-wrapper"
      app
    >
      <v-btn
        color= #126DFF
        flat
        value="recent"
        to="/map"
      >
        <span>Maps</span>
        <v-icon large>directions</v-icon>
      </v-btn>

      <v-btn
        color= #126DFF
        flat
        value="favorites"
        to="/"
      >
        <span>Home</span>
        <v-icon large>home</v-icon>
      </v-btn>

      <v-btn
        color= #126DFF
        flat
        value="nearby"
        to="/team"
      >
        <span>History</span>
        <v-icon large>people</v-icon>
      </v-btn>

      <v-btn
        color= #126DFF
        flat
        value="nearby"
        to="/obd"
      >
        <span>OBD</span>
        <v-icon large>people</v-icon>
      </v-btn>

    </v-bottom-nav>
  </v-card>
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

// .tabnav-wrapper{
//   height: 100%;
//   overflow: hidden;
//   -webkit-box-shadow: inset 0px 3px 8px -3px rgba(0,0,0,0.75);
//   -moz-box-shadow: inset 0px 3px 8px -3px rgba(0,0,0,0.75);
//   box-shadow: inset 0px 3px 8px -3px rgba(0,0,0,0.75);
// }

.v-tabs .v-tabs__bar .v-tabs__bar{
  height: 100%;
}

.tabnav-wrapper{
  height: 100% !important;
}
</style>
