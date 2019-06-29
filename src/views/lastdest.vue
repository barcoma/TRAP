<template lang="html">
    <div class="last-destination-container">
        <v-toolbar class="last-destination-topbar">
            <h5>Letzte Ziele </h5>
        </v-toolbar>
        <ul class="last-locations-list">
            <li v-for="destination in lastDestination" :key="destination.id">
                <v-icon color="white">near_me</v-icon> {{ destination.name }}
            </li>
        </ul>
        <hr class="spacer"/>
    </div>
</template>

<script>
export default {
    name: "lastdest",
    data () {
        return {
        lastDestination: [{
            "name": "Keine letzten Ziele gefunden!",
            id: 0
        }],
        }
    }
} 
</script> 
 
<style scoped lang="scss">

.last-destination-topbar {
    background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); 
}
 
.last-locations-list {
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 1rem;
  padding-left: 0;
  li {
    background-color: rgba(0,0,0, 0.4);
    border-radius: 17px;
    margin-bottom: 0.2rem;
    margin-top: 0.2rem;
    padding: 2rem;
    list-style: none;
    color: white;
  }
}

hr.spacer {
  height: 16rem;
  opacity: 0;
}

</style>
