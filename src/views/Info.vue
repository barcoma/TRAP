<template lang="html">
<div>
    <v-toolbar class="imprint-topbar">
          <h5>Info</h5>
    </v-toolbar>


<div class="welcomebackground">
    <img src="../../public/img/icons/trapp_logo_512x512.png" class="Logo"/>
    <div class="text">
        <p>Diese App ist im Rahmen eines Studienprojekts an der Hochschule Furtwangen entstanden.<br></p>
        
        <h3>Betreuer:</h3>
        <ul>
            <li>Prof. Wolfgang Taube</li>
        </ul>
    <!-- </div> -->
    <br>
    <!-- <div class="projektliste"> -->
        <h3>Projektbeteiligte:</h3>
        <ul>
            <li>Julien Bick</li>
            <li>Marco Balzer</li>
            <li>Robin Schwab</li>
            <li>Jan Schultis</li>
        </ul>
    </div>

 </div>     
 </div>
 
  
</template>

<script>

export default {
    name: "info",
    data: () => ({
      Info: ''
    }),
    methods: {
      
    },
    created() {
    }
} 
</script> 
<style scoped lang="scss">
.imprint-topbar {
  background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); 
  grid-row-start: 1;
  grid-row-end:1;
  grid-column-start:1;
  grid-column-end:4;
  width: 100%;
  height: 100%;
  }
.imprint-content {
  overflow: scroll !important;
  max-height: 90vh;
  padding: 1rem;
  text-align: left;
}
.welcomebackground{
 background-color: #fff;
  height:100vh;
  display:grid;
  grid-template-rows: 20% 20% 20% 40%;
  position:relative;
  grid-template-columns: 15% 70% 15%;
}
.Logo{
  grid-row-start: 4;
  grid-row-end:4;
  grid-column-start:2;
  grid-column-end:4;
  width: 45%;
  height: 50%;
  object-fit: contain;
  justify-self: right;
  align-self: top;
}
.text{
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start:1;
  grid-column-end:4;
  width: 100%;
  margin: 5%;
  text-align: left;
  p{
      font-weight: 800;
      margin-right: 5%;
  }
   h3{
      color: black;
      margin-bottom: .5em;
  }
}
.projektliste{
  grid-row-start: 5;
  grid-row-end: 5;
  grid-column-start:1;
  grid-column-end:4;
  width: 100%;
  text-align: left;
  margin: 5%;
  h3{
      color: black;
  }
  li{
      list-style-type: none;
  }
}

</style>