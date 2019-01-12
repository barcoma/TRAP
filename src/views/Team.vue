<template>
    <v-card-text class="py-0">
    <v-timeline
        align-top
        dense
      >
        <v-timeline-item
          color="blue"
          medium
        >
          <v-layout pt-3>
            <v-flex xs3>
              <strong>Oktober</strong>
            </v-flex>
            <v-flex>
              <strong>Semesterbeginn</strong>
              <div class="caption">Kick-Off</div>
            </v-flex>
          </v-layout>
        </v-timeline-item>

        <v-timeline-item
          color="teal lighten-3"
          small
        >
          <v-layout wrap pt-3>
            <v-flex xs3>
              <strong>Erster Meilenstein</strong>
            </v-flex>
            <v-flex>
              <strong>Proof-of-Concept</strong>
              <div class="caption mb-2"></div>
              <v-avatar>
                <v-img
                  src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown"
                ></v-img>
              </v-avatar>
              <v-avatar>

                <v-img
                  src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Prescription02&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Black&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Tanned"
                ></v-img>
              </v-avatar>
              <v-avatar>
                <v-img
                  src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Pale"
                ></v-img>
              </v-avatar>
            </v-flex>
          </v-layout>
        </v-timeline-item>

        <v-timeline-item
          color="red"
          medium
        >
          <v-layout pt-3>
            <v-flex xs3>
              <strong>Weihnachten</strong>
            </v-flex>
            <v-flex>
              <strong>Erster Prototyp</strong>
            </v-flex>
          </v-layout>
        </v-timeline-item>

        <v-timeline-item
          color="teal lighten-3"
          large
        >
          <v-layout pt-3>
            <v-flex xs3>
              <strong>in the making </strong>
            </v-flex>
            <v-flex>
              <strong>TRAPP</strong>
              <div class="caption">OBD-Travel-App</div>
            </v-flex>
          </v-layout>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'team',
  components: {
    
  }
}
</script>

<style lang="scss">
  
</style>

