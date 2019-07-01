<template lang="html">
<div class="welcomebackground" v-if="noName">

<h3 class="Willkommen">Wilkommen bei TRAPP - deine Travel App </h3>
<v-flex xs12 sm6 class="Nametext">
          <v-text-field 
            label="Name"
            single-line
            solo 
            v-model="name"
            
          ></v-text-field>
        </v-flex>
<v-btn round large class="weiterbtn" @click="saveUserName()" style="color:white;">Weiter</v-btn>

 </div>     
 
  
</template>

<script>

import {eventBus} from '../main.js';

export default {
    name: "welcome",
    data: () => ({
      name: '',
      noName: true
    }),
    methods: {
      saveUserName: function() {
        this.$cookie.set('Username', this.name, { expires: '10Y' });
        this.noName = false;
        eventBus.$emit('updateName');
      }
    },
    created() {
      if(this.$cookie.get('Username') == null) {
        this.noName = true;
      } else {
        this.noName = false;
      }
    }
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
    grid-row: 3;
    grid-column: 2;
    align-self: end;
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
  grid-row-start: 4;
  grid-column-start: 2;
  grid-column-end:3;
  color:white;
  background: -moz-linear-gradient(45deg, rgba(50,234,255,1) 0%, rgba(40,115,214,1) 0%, rgba(182,125,232,1) 100%, rgba(32,124,202,1) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
}

</style>