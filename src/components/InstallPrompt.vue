<template>
<div class="install-prompt" v-if="showInstallBanner == true && neverAgain == false">
    <v-btn fab dark small color="white" v-on:click="showInstallBanner=false" class="install-prompt-btn black--text" data-dismiss="alert">
      <v-icon dark @click="neverShowAgain()">close</v-icon>
    </v-btn>
    <a href="#" @click.prevent="install">App zum Homescreen hinzufügen</a>
</div>
</template>



<script>
let installEvent;
export default {
  name: 'installPrompt',
  data() {
    return {
      showInstallBanner: true,
      showWelcome: false,
      neverAgain: false
    };
  },
  beforeCreate() {
    console.log(this.$cookie.get('neverShowAgain'));
    if (this.$cookie.get('neverShowAgain')) {
      if (this.$cookie.get('neverShowAgain') == true) {
        this.neverAgain = true;
      } else {
        this.neverAgain = false;
      }
    }
  },
  created() {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      installEvent = e;
      this.showInstallBanner = true;
      this.showWelcome = true;
    });
  },
  methods: {
    install: function() {
      this.showInstallBanner = false;
      installEvent.prompt();
      installEvent.userChoice.then(() => {
        installEvent = null;
      });
    },
    neverShowAgain: function() {
      this.neverAgain = true;
      this.$cookie.set('neverShowAgain', this.neverAgain, { expires: '10Y' });
    }
  }
};
</script>

<style scoped>
a {
    background: -moz-linear-gradient(45deg, rgba(50,234,255,1) 0%, rgba(40,115,214,1) 0%, rgba(182,125,232,1) 100%, rgba(32,124,202,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(45deg, rgba(50,234,255,1) 0%,rgba(40,115,214,1) 0%,rgba(182,125,232,1) 100%,rgba(32,124,202,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    padding: 0.8rem 1rem 0.8rem 1rem;
    border-radius: 50px;
    box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
    color: white;
    text-decoration: none;
    font-weight: 500;
}
.install-prompt {
    position: fixed;
    top: 0;
    z-index: 999999999999999;
    width: 100vw;
    padding-top: 1rem;
    padding-bottom: 1rem;
    background-color: rgba(0,0,0,.6);
}
</style>
