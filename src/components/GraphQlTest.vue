<template>
<div>
    <button v-on:click="testCache">log console</button>
    </div>
</template>

<script>
import gql from 'graphql-tag'

export default {

  mounted() {
    this.$apollo.queries.yelpPOI.skip = true;
  },
  apollo: {
    yelpPOI: gql`{
        yelpPOI
        {
            name
            id
            url
            coordinates {
                latitude
                longitude
            }
        }
    }`
  },
  methods: {
    testIntercept: function() {
      this.$apollo.queries.yelpPOI.skip = false;
      var x = this.$apollo.queries.query.refetch({ term: 'food', latitude: 52.520008, longitude: 13.404954, radius: 50, limit: 15 })
      x.then(xd => console.log(xd.data.search));
    },
    testCache: function() {
        const term = this.$apollo.provider.defaultClient.readQuery({
            query: gql`
            query yelpPOI {
                yelpPOI {
                    name
                    id
                    url
                    coordinates {
                        latitude
                        longitude
                    }
                }
            }`
            });
            console.log(term);
        // const test = this.$apollo.provider.defaultClient.readFragment({
        //     id: "YMHJ8K1sdwVCw4XO8ttDNA",
        //     fragment: gql`
        //     fragment poi on yelpPOI {
        //         name
        //         id
        //         url
        //     }
        // `
        // });
        // console.log(test);
    }
  }
}
</script>