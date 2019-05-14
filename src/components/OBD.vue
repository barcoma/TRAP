<template lang="html">
    <section class="OBD">
        <button v-on:click="getDevices">Request devices</button>
    </section>
</template>

<script>
UUID = "00001101-0000-1000-8000-00805F9B34FB";
export default {
    
    name: "OBD",
    data: {


    }, 
    methods: {
        // check chrome://bluetooth-internals
        getDevices: function() {
            navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service']
            })
            .then(device => { 
                console.log(device.name);
                return device.gatt.connect();
            })
            .then(server => { 
                console.log(server);
                return server.getPrimaryService(UUID); 
            })
            .then(service => {
                console.log(service);
                return service.getCharacteristics();
            })
            .then(characteristics => {
                return characteristic.getDescriptors();
                // return characteristic.writeValue();
                //return characteristic.readValue();
            }).then(descriptors  => {
                console.log(descriptors);
            })  
            .then(value => {
                console.log(value.getUint8(0));
            })
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