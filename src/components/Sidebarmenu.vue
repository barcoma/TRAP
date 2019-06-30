<template>
  <v-layout >
    
    <v-container>
      <v-layout justify-center>
          
        <v-btn
         
          @click.stop="drawer = !drawer"
          class="burger"
          fab dark
          left absolute depressed
          >
        
      <v-icon large>dehaze</v-icon>
        
        </v-btn>
      </v-layout>
     
    </v-container>
   
    <v-navigation-drawer
      v-model="drawer"
      width="414"
      absolute
      temporary
      dark
    > 
    
     <div class="menulist">
    <v-list >
        <v-list-tile>
          <v-btn
          @click.stop="drawer = !drawer"
          fab  color="none"
          left absolute flat depressed
          >
        
      <v-icon large color="white">clear</v-icon>
        
        </v-btn>
        </v-list-tile>
        </v-list>

        <v-list  >
        
        <v-list-tile >
          
        <v-list-tile-content >
            <v-list-tile-title >Hi, {{ username }}</v-list-tile-title>
          </v-list-tile-content>
           <!-- <v-flex row class="flex-avatar">
            <v-avatar
          :size="64"
          color="grey lighten-4"
        >
          <img src="https://cdn.pixabay.com/photo/2017/06/05/11/01/airport-2373727_1280.jpg" alt="avatar">
        </v-avatar>
        </v-flex> -->
         
            </v-list-tile>
       
       
      </v-list>

      <v-list class="pt-0" >
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          :to="item.href"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
        </div>

    </v-navigation-drawer>
  </v-layout>
  
</template>

<script>
  export default {
    data () {
      return {
        drawer: null,
        items: [
          { title: 'Karte', icon: 'map', href:"/map" },
          { title: 'Orte finden', icon: 'filter_list', href:"/poi" },
          { title: 'Orte hinzufügen', icon: 'add_location', href:"/createPoi" },
          { title: 'Letzte Ziele', icon: 'access_time', href:"/lastdest" },
          // { title: 'Favoriten', icon: 'star', href:"/map" },
          // { title: 'In der Nähe', icon: 'near_me', href:"/map" },
          // { title: 'Routenplanung', icon: 'navigation', href:"/map" },
          // { title: 'Offline Karten', icon: 'map', href:"/map" },
          { title: 'Fahrzeug Diagnose', icon: 'directions_car', href:"/obd" },
          { title: 'Hilfe', icon: 'help', href:"/help" },
          { title: 'Info', icon: 'info', href:"/welcome" },
          // { title: 'Einstellungen', icon: 'settings', href:"/map" },
          { title: 'Impressum', icon: 'perm_identity', href:"/imprint" },
          { title: 'Datenschutz', icon: 'lock', href:"/privacy" }
        ],
        username: ''
      }
    },
    created() {
      eventBus.$on('updateName', () => {
        this.username = this.$cookie.get('Username');
      })
    },
    mounted() {
      this.username = this.$cookie.get('Username');
    }
  }
</script>

<style lang="scss">
div.v-list__tile__title {
   font-weight: 300;
   font-size: 20px;
   opacity: 1 !important;
   color:white !important;
}
.burger.v-btn{
 top : 5px;
}
button.burger.v-btn.v-btn.theme--dark{

  background-color:unset;
}
.v-navigation-drawer{
   
    position: absolute;
}
aside.v-navigation-drawer.v-navigation-drawer--temporary.theme--dark{
  // background-color: black;
  // background: -webkit-linear-gradient(to right, #4285f4, #00ebff); /* Chrome 10-25, Safari 5.1-6 */
  // background: linear-gradient(to right, #4285f4, #00ebff); 
  background-image: url("/img/bg/trap_sidebarmenu_hintergrund_3.jpg");
  background-position: right;
  background-size: cover;
  height:100%;
}
aside.v-navigation-drawer.bg-image--absolute{
  z-index:1 ;
}
aside.v-navigation-drawer.v-navigation-drawer--absolute{
 z-index: 100;
}
.menulist{
  background-color: unset;
  position: absolute;
  width: 100%;
  height: 100%;
}
  .bg-image {
 background-image: linear-gradient(129deg, #4285f4, var(--neon-blue));

 position: absolute;
  
  filter: blur(20px);
  -webkit-filter: blur(20px);

  /* Full height */
  width:100%;
  height: 100%; 
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.v-list__tile__title{
    height:30px;
}

.v-btn--floating.v-btn--absolute {
  z-index: 100 !important;
}

button.burger.v-btn.v-btn--absolute.v-btn--floating.v-btn--left.v-btn--depressed.theme--dark {
    margin-top: -0.5rem;
}
</style>
