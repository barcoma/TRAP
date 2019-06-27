<template lang="html">
<div class="welcomebackground">

<h3 class="Willkommen">Wilkommen bei TRAPP - deine Travel App </h3>
<v-flex xs12 sm6 class="Nametext">
          <v-text-field 
            label="Name"
            single-line
            solo 
            
          ></v-text-field>
        </v-flex>
<v-btn round large class="weiterbtn"> Weiter </v-btn>

 </div>     
 
  
</template>

<script>



export default {
    name: "welcome",

} 
</script> 
<style scoped lang="scss">

.welcomebackground{
 background: url('../../public/img/backgroundobd.png') no-repeat center center fixed; 
  background-size: cover;
  height:112%;
  display:grid;
  grid-template-rows: 20% 20% 20% 20% 20%;
  z-index: 10000;
  position:relative;
  grid-template-columns: 15% 70% 15%;
}
.Nametext{
  grid-row-start: 4;
  grid-row-end: 5;
  grid-column-start: 2;
  grid-column-end: 3;
}
.Willkommen{
  font-size: 30px;
  font-weight: bold;
  color:white;
  grid-row-start: 2;
  grid-row-end:3;
  grid-column-start:2;
  grid-column-end:3;
}
.weiterbtn{
  grid-row-start: 5;
  grid-column-start: 2;
  grid-column-end:3;
}

</style>