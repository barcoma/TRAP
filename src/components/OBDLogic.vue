<template lang="html">
    <section class="OBD">
        <button v-on:click="startWorker">Request devices</button>
        <h1 color="black">{{currentRPM + obdCommandInfo[0].unit}}</h1>
    </section>
</template>

<script>
var serviceUUID = "e7810a71-73ae-499d-8c15-faa9aef0c3f2";
var charUUID = "bef8d6c9-9c21-4c9e-b632-bd58c1009f9f";
var byteA;
var byteB;
var setupDone = false;
var currentCommand;
var correctReply = false;
var commandAccepted = false;
var numberOfBytes;
var twoBytes = false;


// var obdCommandInfo = [
//     {pid: "0C", bytes: 2, name: "rpm", unit: "rev/min", convertFunction: convertRPM(byteA, byteB)},
// ]

export default {
    name: "OBDLogic",
    data() {
        return{
            writeDelay: 50,
            currentRPM: "0",
            pidResponse: [],
            byteCounter: 0,
            obdCommandInfo: [
                {service: "010C1\r", pid: "0C", bytes: 2, name: "rpm", unit: "rev/min"},
                {service: "0105\r", pid: "05", bytes: 1, name: "engCoolant", unit: "degree"},
                {service: "0146\r", pid: "46", bytes: 1, name: "airTemp", unit: "degree"},
                {service: "015C\r", pid: "5C", bytes: 1, name: "oilTemp", unit: "degree"},
                {service: "015E\r", pid: "5E", bytes: 1, name: "fuelRate", unit: "L/h"},
                {service: "012F\r", pid: "5E", bytes: 1, name: "fuelRate", unit: "percent"},
            ],
            testCount: 0,
            lastBuffer: ArrayBuffer,
            queue: ["010C1\r", "01051\r", "01461\r", "015C\r", "015E\r"],
            lastCommandSent: String
        }
    },
    computed: {

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
            .then(characteristic => characteristic.startNotifications())
            .then(characteristic => {
                let encoder = new TextEncoder('utf-8');
                var commands = [];
                commands.push(encoder.encode("ATD\r\n"));
                commands.push(encoder.encode("ATZ\r\n"));
                commands.push(encoder.encode("ATE0\r\n"));
                commands.push(encoder.encode("ATL0\r\n"));
                commands.push(encoder.encode("ATS0\r\n"));
                commands.push(encoder.encode("ATH0\r\n"));
                commands.push(encoder.encode("ATSP0\r\n"));

                this.sendCommands(characteristic, commands);                
                
                characteristic.addEventListener('characteristicvaluechanged',
                this.handleCharacteristicValueChanged);

                var obdCommand = "010C1\r";
                var testArray = this.encodeCommand(obdCommand);  

                // setInterval(function(){
                //     return characteristic.writeValue(testArray);
                // }, 3000);

                var commandToSend = this.encodeCommand(this.queue[0]);
                this.lastCommandSent = commandToSend;
                // if(queueCount >= this.queue.length){
                //     queueCount = 0;
                // };
                setInterval(function(){
                    return characteristic.writeValue(commandToSend);
                }, 3000);
                        // for(i = 0; i < this.queue.length; i++){
                        //     var commandToSend = this.encodeCommand(this.queue[i]);
                        //     characteristic.writeValue();
                        //     if (i=this.queue.length){

                        //     }
                        // }            
            })
            .then(value => {
                console.log(value);
            })
            .catch(error => { 
                console.log(error.message); 
            });
        },
        handleCharacteristicValueChanged: function(event) {
            let value = event.target.value;
            var decoder = new TextDecoder('ascii');
            var command = decoder.decode(this.lastCommandSent);
            // var replyBytes = this.obdCommandInfo.find(function(service){
            //     return service == command;
            // });
            var replyBytes = 2;
            var currentBufferDecoded = decoder.decode(value.buffer);
            if(this.lastBuffer.byteLength > 0){
            var lastBufferDecoded = decoder.decode(this.lastBuffer);
            }
            if ( lastBufferDecoded == command){
                this.setupDone = true;
            }
            if(this.setupDone == true){
                if(currentBufferDecoded == "41"){
                    this.byteCounter = replyBytes + 2;
                }
                if (this.byteCounter > 0){
                    this.pidResponse.push(currentBufferDecoded);
                    this.byteCounter--;
                    if(this.byteCounter == 0){
                        this.pidResponse.splice(0,2);
                        var reply = this.convertValue(this.pidResponse);
                        console.log("pid: " +command + 'value:' +reply);

                        //this.obdCommandInfo[0].convertFunction(this.pidResponse[3], this.pidResponse[4])
                        // this.currentRPM = this.convertRPM(this.pidResponse[2], this.pidResponse[3]);
                        // console.log(this.currentRPM);
                        this.pidResponse = [];
                    }
                }
            }
            this.lastBuffer = value.buffer;
        },
        sleep: function(delay) {
            var start = new Date().getTime();
            while (new Date().getTime() < start + delay);
        },    
        sendCommands: function(char, commands) {
            let encoder = new TextEncoder('utf-8');

            // maybe improved sleep function, needs testing
            // const sleep = (delay) => {
            //     return new Promise(resolve => setTimeout(resolve, delay))
            // }

            var i = 0;
            while(i < commands.length)
            {
                //sleep(50).then(() => {
                    char.writeValue(commands[i]);
                    i++;
                    this.sleep(500);
                //})
                //this.sleep(1000);
            }
        },
        encodeCommand: function(command) {
            var asciiCommand = [];
            for (var i = 0; i < command.length; i++) {
                asciiCommand[i] = command.charCodeAt(i);
            }
            return new Uint8Array(asciiCommand);
        },
        bnparseCommand: function() {
            var callFunction = obdCommandInfo.find(function(element) {
                return element == currentCommand;
            });
            callFunction.convertFunction;
        },
        convertRPM: function(byteA, byteB) {
            return ((parseInt(byteA, 16) * 256) + parseInt(byteB, 16)) / 4;
        },
        convertRate: function(byteA, byteB) {
            return ((parseInt(byteA, 16) * 256) + parseInt(byteB, 16)) / 20;
        },
        convertTemp: function(byteA){
            return byteA - 40;
        },
        convertValue: function(response){
            var reply;
            switch(response.length){
                case 1:
                    reply = parseInt(response[0], 16) - 40;
                    break;
                case 2:
                    reply = ((parseInt(response[0], 16) * 256) + parseInt(response[1], 16)) / 4;
                    break;
            }
            return reply;
        },
        startWorker: function(){
            this.$worker.run(this.getDevices(), [this.$data])
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

<style scoped>
 h1{
     color: black;
 }
</style>
