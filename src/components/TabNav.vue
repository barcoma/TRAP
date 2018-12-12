<template>
  <b-tabs class="tabnav-tabs" expanded animated>
    <b-tab-item label="fotze" icon="google-photos"></b-tab-item>
    <b-tab-item label="Music" icon="library-music"></b-tab-item>
    <b-tab-item label="Videos" icon="video"></b-tab-item>
  </b-tabs>
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

.tabnav-tabs{
  height: 100%;
}

.b-tabs .tabs{
  height: 100%;
}

.tab-content{
  padding: 0;
}

.tabs a{
  border: none !important;
}

.tabs li.is-active a{
  color: #1043b1 !important;
}
</style>
