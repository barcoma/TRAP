<template>
<div>
    <v-toolbar class="help-topbar">
        <h5>Hilfe</h5>
    </v-toolbar>
  <v-stepper class="help-content" v-model="e6" vertical non-linear>
    <v-stepper-step editable step="1">
        Test
        <small>Summarize if needed</small>
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-img src="/img/helpscreens/help-navigate.png" aspect-ratio="1.7" contain height="500"></v-img> 
      <v-btn round color="primary" @click="e6 = 2">Weiter</v-btn>
    </v-stepper-content>

        <v-stepper-step
          editable
          step="2"
        >Configure analytics for this app</v-stepper-step>

    <v-stepper-content step="2">
      <v-card color="grey lighten-1" class="mb-2" height="200px"></v-card>
      <v-btn round color="primary" @click="e6 = 3">Weiter</v-btn>
    </v-stepper-content>

        <v-stepper-step
          editable
          step="3"
        >Select an ad format and name ad unit</v-stepper-step>

    <v-stepper-content step="3">
      <v-card color="grey lighten-1" class="mb-2" height="200px"></v-card>
      <v-btn round color="primary" @click="e6 = 4">Weiter</v-btn>
    </v-stepper-content>

       <v-stepper-step
          editable
          step="4"
        >View setup instructions</v-stepper-step>
    <v-stepper-content step="4">
      <v-card color="grey lighten-1" class="mb-2" height="200px"></v-card>
      <v-btn round color="primary" @click="e6 = 1">Weiter</v-btn>
    </v-stepper-content>

    <v-stepper-step
          editable
          step="5"
        >View setup instructions</v-stepper-step>
    <v-stepper-content step="5">
      <v-card color="grey lighten-1" class="mb-2" height="200px"></v-card>
      <v-btn round color="primary" @click="e6 = 1">Weiter</v-btn>
    </v-stepper-content>
  </v-stepper>
</div>
</template>


<script>
import { eventBus } from '../main.js'

export default {
  name: 'Help',
  components: {

  },
  data() {
    return {
        e6: 1
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style lang="scss">
.theme--light.v-stepper .v-stepper__step__step, .theme--light.v-stepper .v-stepper__step__step .v-icon {
        background-color: #1867c0!important;
    border-color: #1867c0!important;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
            background-color: #1867c0!important;
    border-color: #1867c0!important;
}

.help-topbar {
        background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); 
}

.help-content {
    overflow: scroll !important;
    max-height: 90vh;
}

</style>
