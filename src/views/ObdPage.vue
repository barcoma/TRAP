<template lang="html">
<v-app>
  <v-container>

    <v-layout row wrap class="top">
        <v-layout mt-0 mb-0 align-center class="location">
         <OBD-Logic></OBD-Logic>
        </v-layout>
    </v-layout>  

        <v-layout row wrap class="card">
            <OBD-Card></OBD-Card>
        </v-layout>

  </v-container>  
  </v-app>
</template>
</template>
 
<script lang="js">
import OBDLogic from '../components/OBDLogic.vue' 
import OBDCard from '../components/OBDCard.vue' 

export default {
    name: "OBD",
    components: {
    OBDLogic,
    OBDCard
    },
}
</script>

<style scoped>
    .card{
        height: 30vh;
        width: 100%;
    }

    .top{
        margin-top: 10vh;
    }
</style>
