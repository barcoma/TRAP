<template>
  <v-card
    class="mx-auto"
    color="grey lighten-4"
    max-width="600"
  >
    <v-card-title>
      <v-icon
        color= "#000000"
        class="mr-5"
        size="64"
        @click="updateValue"
      >
        fa-temperature-high
      </v-icon>
      <v-layout
        column
        align-start
      >
        <div class="caption grey--text text-uppercase">
          Temperatur
        </div>
        <div>
          <span
            class="display-2 font-weight-black"
            v-text="avg || '—'"
          ></span>
          <strong v-if="avg">°C</strong>
        </div>
      </v-layout>

      <v-spacer></v-spacer>

      <v-btn icon class="align-self-start" size="28">
        <v-icon>mdi-arrow-right-thick</v-icon>
      </v-btn>
    </v-card-title>

    <v-sheet color="transparent">
      <v-sparkline
        :key="String(avg)"
        :smooth="16"
        :gradient="['#4285f4', '#00ebff']"
        :line-width="3"
        :value="heartbeats"
        auto-draw
        stroke-linecap="round"
      ></v-sparkline>
    </v-sheet>
  </v-card>
</template>
 
<script>
  const exhale = ms =>
    new Promise(resolve => setTimeout(resolve, ms))

  export default {
    name: 'OBDCard',
    data: () => ({
      checking: false,
      heartbeats: []
    }),

    computed: {
      avg () {
        // const sum = this.heartbeats.reduce((acc, cur) => acc + cur, 0)
        // const length = this.heartbeats.length

        // if (!sum && !length) return 0

        // return Math.ceil(sum / length)
        return this.heartbeats[this.heartbeats.length - 1]
      }
    },

    created () {
      this.takePulse(false)
    },

    methods: {
      heartbeat () {
        return Math.ceil(Math.random() * (95 - 85) + 85);
      },
      async takePulse (inhale = true) {
        this.checking = true

        inhale && await exhale(1000)

        this.heartbeats = Array.from({ length: 10 }, this.heartbeat)

        this.checking = false
      },
      updateValue() {
          this.heartbeats.push(this.heartbeat());
          console.log(this.heartbeats);
      }
    }
  }
</script>

<style scoped lang="scss">

</style>