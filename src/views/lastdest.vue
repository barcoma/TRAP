<template lang="html">

    <section class="Kategorien">
 

      <v-toolbar extended class="topbar2">
           
      </v-toolbar>
      
    </section>
</template>

<script>

import Sidebarmenu from '../components/Sidebarmenu.vue'


export default {
    name: "lastdest",
    
       
    components:{
    Sidebarmenu
    },
} 
</script> 
<style lang="scss">


.topbar2{
    background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); 
    height:20%;
    width: 100%;
    opacity:1;
}
</style>
