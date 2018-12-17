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
            .then(device => { /* ... */ })
            .catch(error => { console.log(error); });
        }
    }
}
</script>