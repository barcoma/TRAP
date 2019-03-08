<template>
  <div>{{hello}}</div>
</template>

<script>
import gql from 'graphql-tag'


export default {
  apollo: 
  {
    hello: gql`query {
      hello
    }`,
  }
};
</script>