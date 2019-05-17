<template>
    <div v-if="showPopUp" class="popUp-container">
        <v-btn dark icon v-on:click="showPopUp=false" class="popUp-close-btn">
            <v-icon dark>close</v-icon>
        </v-btn>
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
      }
    };
  },
  created() {
      eventBus.$on('showPopUp', (title, text) => {
          this.popUp.title = title;
          this.popUp.text = text;
          this.showPopUp = true;
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
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
    height: 9rem;
    margin-top: -9rem;
    border-radius: 12px;
    .popUp-close-btn {
        position: absolute;
        right: 0rem;
    }
    .popUp-title {
        color: white;
        margin-top: 1rem;
        font-size: 16px;
        position: absolute;
        left: 1rem;
    }
    .popUp-description {
        position: absolute;
        color: white;
        padding: 1rem;
        margin-top: 3rem;
    }
}
</style>
