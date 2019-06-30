<template lang="html">
    <section class="OBD">
        <v-btn color=blue light v-on:click="startWorker">Request devices</v-btn>
        <!-- <h1 color="black">{{obdCommandInfo[0].name + obdCommandInfo[0].unit}}</h1> -->

        <v-list>
          <v-list-tile v-for="obd in obdCommandInfo">
            <v-list-tile-content>
              <v-list-tile-title>{{obd.name}} : {{obd.value}} {{obd.unit}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
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
                {service: "010C1\r", pid: "0C", bytes: 2, name: "Drehzahl", unit: "U/min", value: 0},
                {service: "01051\r", pid: "05", bytes: 1, name: "Engine Coolant", unit: "Grad", value: 0},
                // {service: "01461\r", pid: "46", bytes: 1, name: "Ambient Air Temp", unit: "Grad", value: 0},
                {service: "015C1\r", pid: "5C", bytes: 1, name: "Oil Temp", unit: "Grad", value: 0},
                {service: "015E1\r", pid: "5E", bytes: 1, name: "fuelRate", unit: "L/h", value: 0},
                {service: "012F1\r", pid: "5E", bytes: 1, name: "fuelPercentage", unit: "%", value: 0},
            ],
            testCount: 0,
            lastBuffer: ArrayBuffer,
            queue: ["010C1\r", "01051\r", "015C1\r", "015E1\r"],
            lastCommandSent: String,
            replyBytes: Number,
            repliedCommand: null

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
                
                var encodedCommands = [];
                this.queue.forEach(el => {encodedCommands.push(this.encodeCommand(el));});

                var queueIndex = -1;
                this.lastCommandSent = this.queue[queueIndex];

                setInterval(function(){
                    queueIndex++;
                    if(queueIndex > 1){
                        queueIndex = 0;
                    }
                    return characteristic.writeValue(encodedCommands[queueIndex]);
                }, 3000);
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
            var currentBufferDecoded = decoder.decode(value.buffer);
            console.log(currentBufferDecoded);
            if(this.lastBuffer.byteLength > 0){
            var lastBufferDecoded = decoder.decode(this.lastBuffer);
            } 
            if(!this.repliedCommand){
            this.repliedCommand = this.obdCommandInfo.find(obj =>{
            return obj.service == currentBufferDecoded;
            });
            }
            //var obj = this.obdCommandInfo.find(obj => obj.service == command);
            if (this.repliedCommand){
                this.setupDone = true;
                this.replyBytes = this.obdCommandInfo.find(obj =>{
                return obj.service == this.repliedCommand.service;
            });
            }
            if(this.setupDone == true){
                if(currentBufferDecoded == "41"){
                    this.byteCounter = this.replyBytes.bytes + 2;
                    console.log(currentBufferDecoded);
                }
                if (this.byteCounter > 0){
                    this.pidResponse.push(currentBufferDecoded);
                    this.byteCounter--;
                    if(this.byteCounter == 0){
                        this.pidResponse.splice(0,2);
                        var reply = this.convertValue(this.pidResponse);
                        console.log("pid: " +this.repliedCommand.name + '  value: ' +reply);
                        this.pidResponse = [];
                        this.repliedCommand = null;
                    }
                }
            }
            this.lastBuffer = value.buffer;
        },
        sleep: function(delay) {
            var start = new Date().getTime();
            while (new Date().getTime() < start + delay);

            //return new Promise(resolve => setTimeout(resolve, delay));
            // const sleep = (delay) => {
            //     return new Promise(resolve => setTimeout(resolve, delay))
            // }
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
                    //await this.sleep(500) wenn mit sleep-Funktion mit Promise 
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

 .OBD{
     width: 100%;
 }

 .OBD-list{
     list-style-type: none;
     font-weight: 800;
     text-align: left;
     margin-top: 5vh;
 }
</style>
