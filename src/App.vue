<template>
  <div id="app">
    <welcome v-if="showWelcome"> </welcome>
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
import mapboxgl from 'mapbox-gl'
import PopUp from './components/PopUp.vue'
import Sidebarmenu from './components/Sidebarmenu.vue'




export default {
  name: 'app',
  components: {
    MapBox,
    TabNav,
    InstallPrompt,
    PopUp,
    Sidebarmenu
  },
  methods: {
    removeGeocode: function(){
      this.$refs.MapBox.remove();
    }
  }
}

</script>

<style lang="scss">

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

</style>
