<template>
  <v-container fluid class="banane">
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

  </v-container>
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
  }

  .home-progressbar{
    vertical-align: middle;
  }

  .v-progress-circular{
    top: 40% !important;
}

</style>

