<template lang="html">
    <section class="OBD">
        <button v-on:click="getDevices">Request devices</button>
    </section>
</template>

<script>
var serviceUUID = "e7810a71-73ae-499d-8c15-faa9aef0c3f2";
var charUUID = "bef8d6c9-9c21-4c9e-b632-bd58c1009f9f";
export default {
    name: "OBD",
    data: {

    }, 
    methods: {
        getDevices: function() {
            navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [serviceUUID]
            })
            .then(device => { 
                console.log(device.name);
                return device.gatt.connect();
            })
            .then(server => { 
                console.log(server);
                return server.getPrimaryService(serviceUUID);
            })
            .then(service => {
                console.log(service);
                return service.getCharacteristic(charUUID);
            })
            .then(characteristic => {
                console.log(characteristic);
                let encoder = new TextEncoder('utf-8');
                let message = encoder.encode("ATZ\r\n");
                var data = new Uint8Array([0x01, 0x00, 0x0D]);

                // var x = '\x01\x00\r'
                // const buffer = new ArrayBuffer(3);
                // const uint8 = new Uint8Array(buffer);
                // uint8.set([01, 00, 13]);

                characteristic.writeValue(message);
                return characteristic.readValue();
            })
            .then(value => {
                console.log(value);
            })
            .catch(error => { console.log(error.message); });
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