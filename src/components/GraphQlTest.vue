<template>
<!-- <ApolloQuery
  :query="queries.query"
  :variables="{ term: 'food', latitude: 52.520008, longitude: 13.404954, radius: 50, limit: 15 }">
  <template slot-scope="{ result: { loading, error, data } }">
    {{data}}
    <div v-if="loading" class="loading apollo">Loading...</div>

    <div v-else-if="error" class="error apollo">An error occured</div>

    <div v-else-if="data" class="result apollo"></div>

    <div v-else class="no-result apollo">No result :(</div>
  </template>
  <button v-on:click="test">log console</button>
</ApolloQuery> -->
<div>
    <button v-on:click="testIntercept">log console</button>
    <div>{{query}}</div>
</div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  // data () {
  //   return {
  //     queries: {
  //       query: gql`
  //       {
  //         search 
  //         {
  //           total,
  //           business {
  //             name
  //             coordinates {
  //               latitude
  //               longitude
  //             }
  //           }
  //         }
  //       }`
  //     },
  //     data: Object
  //   }
  // },
// const yelpQuery = 
// gql`
//   {
//     search 
//     {
//       total,
//       business {
//         name
//         coordinates {
//           latitude
//           longitude
//         }
//       }
//     }
//   }`

  mounted() {
    this.$apollo.queries.query.skip = true;
  },
  apollo: {
    query: gql`{
      search
      {
        total
        business {
          name
          coordinates {
            latitude
            longitude
          }
        }
      }
    }`
  },
  methods: {
    testIntercept: function() {
      this.$apollo.queries.query.skip = false;
      var x = this.$apollo.queries.query.refetch({ term: 'food', latitude: 52.520008, longitude: 13.404954, radius: 50, limit: 15 })
      x.then(xd => console.log(xd.data.search));
    },
  }
}
</script>