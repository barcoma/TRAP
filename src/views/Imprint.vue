<template>
  <div class="imprint-container">
    <v-toolbar class="imprint-topbar">
          <h5>Impressum</h5>
    </v-toolbar>
    <div class="imprint-content">
      <p>Wolfgang Taube<br />Hochschule Furtwangen University<br />Fakultät Digitale Medien<br />78120 Furtwangen im Schwarzwald</p>
      <p>Telefon: 07723 920-2520<br />E-Mail: <a href="mailto:Wolfgang.Taube@hs-furtwangen.de">Wolfgang.Taube@hs-furtwangen.de</a><br />Website: <a href="https://www.hs-furtwangen.de">https://www.hs-furtwangen.de</a></p>
    </div>
  </div>
</template>


<script>
import { eventBus } from '../main.js'

export default {
  name: 'Imprint',
  components: {

  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.imprint-topbar {
  background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); 
  }
.imprint-content {
  overflow: scroll !important;
  max-height: 90vh;
  padding: 1rem;
  text-align: left;
}

a {
    text-decoration: none;
    color: black;
}
</style>
