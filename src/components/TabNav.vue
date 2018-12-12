<template>
  <div>
    <router-link to="/">Hier</router-link>
    <router-link to="/next">Home</router-link>
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

</style>
