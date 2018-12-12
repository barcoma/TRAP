<template>
</template>

<script>
export default {
    name: 'OBD',
    mounted() {
    this.$http.get('http://192.168.0.10:35000').then(response => {

    // get body data
    this.someData = response.body;
    console.log(someData);

  }, response => {
    // error callback
  });
    }
}
</script>