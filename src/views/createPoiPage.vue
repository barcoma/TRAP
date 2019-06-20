<template>
    <create-poi></create-poi>
</template>


<script>
import { eventBus } from '../main.js'
import CreatePoi from '../components/CreatePoi.vue'

export default {
  name: 'createPoiPage',
  components: {
    CreatePoi
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

</style>
