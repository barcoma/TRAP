<template>
  <div>{{search.total}}</div>
</template>

<script>
import gql from 'graphql-tag'


export default {
  apollo: 
  {
    search: gql`query {
      search {
        total,
        business {
          name
          coordinates {
            latitude
            longitude
          }
        }
      }
    }`,
  }
};
</script>