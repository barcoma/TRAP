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
export default {
  name: 'PopUp',
  data() {
    return {
      showPopUp: true,
      popUp: {
          title: String,
          text: String
      }
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.popUp-container {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.8);
    top: 45%;
    z-index: 9999999999999;
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
    height: 9rem;
    border-radius: 12px;
    .popUp-close-btn {
        position: fixed;
        left: 6%;
    }
    .popUp-title {
        color: white;
        margin-top: 1rem;
    }
    .popUp-description {
        color: white;
    }
}
</style>
