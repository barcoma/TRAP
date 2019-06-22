<template>
  <div class="imprint-container">
    <v-toolbar class="imprint-topbar">
          <h5>Impressum</h5>
    </v-toolbar>
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
</style>
