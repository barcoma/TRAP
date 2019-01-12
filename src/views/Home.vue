<template>



<v-container fluid class="home-wrapper">
  <v-layout justify-center fill-height>    
  <v-flex xs7 align-self-center>
  <h1>Login</h1>
  <form class="home-form">
    <v-text-field
      color="white lighten-2"
      :counter="10"
      label="Name"
      required
    ></v-text-field>

    <v-text-field
      color="white darken-2"
      label="E-mail"
      required
    ></v-text-field>
    
    <v-checkbox
      color="white darken-2"
      label="Do you agree?"
      required
    ></v-checkbox>

    <v-btn
      block      
      color= #fff
    >
      submit
    </v-btn>
    
    <v-btn
      outline
      color = #fff
      block
    >
      clear
    </v-btn>
  </form>
  </v-flex>
  </v-layout>
</v-container>

















  <!-- <v-container fluid class="banane">
    <v-layout column>
      <v-flex>
        <h3>Projekt Fahrzeug-Reise-Web-App</h3>
      </v-flex>
    </v-layout>

    <v-layout align-content-center fill-height>
      <v-flex>
        <progress-bar></progress-bar>
      </v-flex>
    </v-layout>

  </v-container> -->
</template>

<script>
// @ is an alias to /src
import ProgressBar from '../components/ProgressBar.vue'

export default {
  name: 'home',
  components: {
    ProgressBar
  }
}
</script>

<style lang="scss">
  .banane{
    overflow: hidden;
    height: 100%;
    width: 100%;
    background: #acb6e5;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, #86fde8, #acb6e5);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #86fde8, #acb6e5); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  h1{
    color: white;
  }

  .home-progressbar{
    vertical-align: middle;
  }

  .v-progress-circular{
    top: 40% !important;
}

.home-wrapper{
  height: 100%;
  margin: 0;
  background: #4B79A1;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #283E51, #4B79A1);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #283E51, #4B79A1); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  .v-text-field{
    margin: 0;
  }

  .home-form{
    width: 100%;
    height: 100%;
    padding: 5%;
  }
  .v-label, .v-counter{
    color: white !important;
  }

  .theme--light.v-text-field>.v-input__control>.v-input__slot:before{
    border-color: rgba(255, 255, 255, 0.42);
  }

  .theme--light.v-input:not(.v-input--is-disabled) input, .theme--light.v-input:not(.v-input--is-disabled) textarea{
    color: white;
  }
}

</style>

