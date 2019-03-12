<template lang="html">
  <section class="Map-Nav">
    <div class="menu-icon-container" 
      v-on:click="showNav()"
      v-bind:class="{ change : isVisible }"
      >
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
    </div>
    <div 
        v-bind:class="{ visible : isVisible }"
        class="menu-background"
        ref="MapMenu"
        >
        <h1>Menü</h1>
        <ul class="menu-list">
            <li class="menu-item" v-on:click="showRoutes()">Route</li>
            <li class="menu-item">Statistiken</li>
            <li class="menu-item">OBD</li>
        </ul>
    </div>

  </section>
</template>
 
<script lang="js">
import {eventBus} from '../main.js';

  export default  {
    name: 'MapNav',
    props: [],
    data() {
      return {
        isVisible: false,
        showNavigation: false
      }
    },
    mounted() {
    },
    methods: {
        showNav: function(){
            this.isVisible = !this.isVisible;
            if(this.isVisible == false && this.showNavigation == true){
                this.showRoutes();
            }
        },
        showRoutes: function(){
            this.showNavigation = !this.showNavigation;
            eventBus.$emit('toggleDirections', this.showNavigation);
        }
    },
    computed: {
 
    }
}
</script>
 
<style scoped lang="scss">

// Menu Icon


.menu-icon-container {
    display: inline-block;
    cursor: pointer;
    z-index: 1;
    position: relative;
    top: -80vh;
    right: 47vw;
}

.bar1, .bar2, .bar3 {
    width: 35px;
    height: 5px;
    background-color: #333;
    margin: 6px 0;
    transition: 0.4s;
}

.change .bar1 {
    background-color: #fff;
    -webkit-transform: rotate(-45deg) translate(-9px, 6px);
    transform: rotate(-45deg) translate(-9px, 6px);
}

.change .bar2 {opacity: 0;}

.change .bar3 {
    background-color: #fff;
    -webkit-transform: rotate(45deg) translate(-8px, -8px);
    transform: rotate(45deg) translate(-8px, -8px);
}



// Menu Icon End

.hidden{
    left: -100vw;

}

.visible{
    left: 0 !important;
    transition: 0.4s;
}

.menu-background{
    color: white;
    background-color: rgb(72, 58, 204);
    position: absolute;
    left: -100vw;
    top: 0;
    width: 100vw;
    height: 100vh;
    .menu-list{
        list-style-type: none;
        font-size: 1.2em;
        text-align: left;
        margin-bottom: 50px;
    }
    .menu-item{
        margin-bottom: 2vh;
    }
    transition: 0.4s;

  }

.Btn-nav{
  z-index: 1;
  position: relative;
  top: -114.5vh;
  right: 47vw;
  height: 3vw;
  width: 3vw;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  font-weight: 900;
  border-radius: 15px;
}
</style>