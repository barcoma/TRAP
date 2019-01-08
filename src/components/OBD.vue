<template lang="html">
    <section class="OBD">
        <button v-on:click="getDevices">Request devices</button>
    </section>
</template>

<script>
export default {
    name: "OBD",
    data: {

    }, 
    methods: {
        getDevices: function() {
            navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service']
            })
            .then(device => { 
                console.log(device.name);
                return device.gatt.connect();
            })
            .then(server => { /* ... */ })
            .catch(error => { console.log(error); });
        }
    
    },
    mounted() {
    // this.$http.get('http://192.168.0.10:35000').then(response => {

    // // get body data
    // this.someData = response.body;
    // console.log(someData);

  //}, response => {
    // error callback
  //});
}
}
</script>