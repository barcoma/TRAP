<template>
    <div class="POI-container">
        <h1>Orte finden</h1>
        <h2>Von wo sollen die Daten stammen ?</h2>
        <ul>
            <li>Yelp</li>
            <li>Foursquare</li>
            <li>Eigene</li>
        </ul>
        <h2></h2>
    </div>
</template>


<script>
import { eventBus } from '../main.js'

export default {
  name: 'PoiFilter',
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

</style>
