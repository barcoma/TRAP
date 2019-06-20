<template>
<div>
    <button v-on:click="alterCache">put poi filter in cache</button>
    <br/><button v-on:click="readPoiFilterParams">read pois from cache</button>
</div>
</template>

<script>
import gql from 'graphql-tag'
    const poiFilterQuery = gql` 
    query GetFilterParams {
        poiFilter @client {
            category {
                autorepair
                food
                hotels
                servicestations
                physicians
            }
            source {
                yelp
                foursquare
                custom
            }
        }
    }`

    const updatePoiFilter = gql`
        mutation($category: Object, $source: Object) {
            updatePoiFilterParams(category: $category, source: $source) @client
        }
    `;


export default {

  mounted() {
  },
  apollo: {
  //   yelpPOI: {
  //     query: gql` query yelpPOI ($latitude: Float!, $longitude: Float!, $term: String, $radius: Int, $limit: Int, $categories: String) 
  //     {
  //       yelpPOI (latitude: $latitude, longitude: $longitude, term: $term, radius: $radius, limit: $limit, categories: $categories)
  //       {
  //         name
  //         coordinates {
  //           latitude
  //           longitude
  //         }
  //       }
  //     }`, variables: {},
  //     skip () {
  //       this.$apollo.queries.yelpPOI.skip = true;
  //     }
  //   },

    // yelpPOI: gql`{
    //     yelpPOI
    //     {
    //         name
    //         id
    //         url
    //         coordinates {
    //             latitude
    //             longitude
    //         }
    //     }
    // }`
  },
  methods: {
    alterCache: function() {
        const source = {
            yelp: true,
            foursquare: true,
            custom: true
        };
        const category =  {
            autorepair: true,
            food: false,
            hotels: false,
            servicestations: false,
            physicians: false
        }

        this.$apollo.mutate({
            mutation: updatePoiFilter,
            variables: { category, source }
        })
    },
    readPoiFilterParams: function() {

        const result = this.$apollo.provider.defaultClient.readQuery({
            query: poiFilterQuery
        });
        

        console.log(result);

        // this.$apollo.query({
        //     query: poiFilterQuery 
        // }).then(response => {
        //     console.log(response);
        // })
    },
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