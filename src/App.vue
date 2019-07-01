<template>
  <div id="app">
    <cookie-law>
      <!-- <div slot="message">
        
      </div> -->
      <div class="cookie-law" slot-scope="props">
        <p>Diese Website verwendet Cookies – nähere Informationen dazu und zu Ihren Rechten als Benutzer finden Sie in unserer <router-link to="/privacy">Datenschutzerklärung</router-link> am Ende der Seite. Klicken Sie auf „Akzeptieren“, um Cookies zu akzeptieren und direkt unsere Website besuchen zu können.</p>
        <button class="Cookie__button" @click="props.accept"><span>Akzeptieren</span></button>
      </div>
    </cookie-law>
    <welcome></welcome>
    <sidebarmenu class="sidebarmenu"/>
    <install-prompt></install-prompt>
    <pop-up></pop-up>
    <section class="app-content">
      
      <router-view/>
    </section>

    <section class="app-nav">
      <tab-nav></tab-nav>
    </section>
  </div>
</template>


<script>
import MapBox from './components/MapBox.vue'
import TabNav from './components/TabNav.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import Sidebarmenu from './components/Sidebarmenu.vue'
import mapboxgl from 'mapbox-gl'
import PopUp from './components/PopUp.vue'
import Welcome from './views/Welcome.vue'
import CookieLaw from 'vue-cookie-law'



export default {
  name: 'app',
  components: {
    MapBox,
    TabNav,
    InstallPrompt,
    PopUp,
    Sidebarmenu,
    Welcome,
    CookieLaw
  },
  methods: {
    removeGeocode: function(){
      this.$refs.MapBox.remove();
    }
  }
}

</script>

<style lang="scss">

html {
  scroll-behavior: smooth;
}

button:focus{
  border: none !important;
}

body{
  margin: 0;
}

.app-content{
  height: 90%;
}

.app-nav{
  height: 10%;
}

.mapboxgl-canvas-container{
  canvas{
    position: relative !important;
  }
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  height: 100vh;
}

#map-navigation{
  z-index: 10;
}

// Hamburger Icon
.burger.v-btn {
 top: 5px;
}
.Cookie__button {
  border-radius: 50px !important;
  background: -moz-linear-gradient(45deg, rgba(50,234,255,1) 0%, rgba(40,115,214,1) 0%, rgba(182,125,232,1) 100%, rgba(32,124,202,1) 100%) !important; /* FF3.6-15 */
  background: -webkit-linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%) !important; /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
}

</style>
