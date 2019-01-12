<template>
        <v-progress-circular
        :size="70"
        :width="7"
        color="white"
        indeterminate
        ></v-progress-circular>

</template>

<script>
export default  {
    name: 'ProgressBar',
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

<style>

.progressbar-wrapper{
    height: 100%;
}


</style>
