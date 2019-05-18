<template>
    <div v-if="showPopUp" class="popUp-container">
        <v-btn dark icon v-on:click="showPopUp=false" class="popUp-close-btn">
            <v-icon dark>close</v-icon>
        </v-btn>
        <v-icon v-bind:style="{ color: warningColor }" dark class="popUp-warning-icon">warning</v-icon>
        <h2 class="popUp-title">{{ popUp.title }}</h2>
        <p class="popUp-description">{{ popUp.text }}</p>
    </div>
</template>


<script>
import { eventBus } from '../main.js';

export default {
  name: 'PopUp',
  data() {
    return {
      showPopUp: false,
      popUp: {
          title: String,
          text: String
      },
      warningColor: ""
    };
  },
  created() {
      eventBus.$on('showPopUp', (title, text, color) => {
          this.popUp.title = title;
          this.popUp.text = text;
          this.showPopUp = true;
          this.warningColor = color;
      })
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.popUp-container {
    position: relative;
    background-color: rgba(0, 0, 0, 0.8);
    top: 45%;
    z-index: 9999999999999;
    width: 96%;
    margin-left: 2%;
    margin-right: 2%;
    height: 9rem;
    margin-top: -9rem;
    border-radius: 12px;
    box-shadow: 3px 4px 42px black;
    .popUp-close-btn {
        position: absolute;
        right: 0rem;
    }
    .popUp-warning-icon {
        font-size: 50px;
        position: absolute;
        left: 1rem;
        top: 31%;
    }
    .popUp-title {
        color: white;
        margin-top: 1rem;
        font-size: 16px;
        position: absolute;
        left: 5.5rem;
        top: 1rem;
    }
    .popUp-description {
        position: absolute;
        color: white;
        margin-top: 3rem;  
        left: 5.5rem; 
        top: 1rem;
        text-align: left;
    }
}
</style>
