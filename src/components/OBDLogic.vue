<template lang="html">
    <section class="OBD">
        <button v-on:click="getDevices">Request devices</button>
        <h1 color="black">{{currentRPM + obdCommandInfo[0].unit}}</h1>
    </section>
</template>

<script>
var serviceUUID = "e7810a71-73ae-499d-8c15-faa9aef0c3f2";
var charUUID = "bef8d6c9-9c21-4c9e-b632-bd58c1009f9f";
var byteA;
var byteB;
var lastBuffer;
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
    name: 'OBDLogic',
    data() {
        return{
            currentRPM: "0",
            pidResponse: [],
            byteCounter: 0,
            obdCommandInfo: [
                {pid: "0C", bytes: 2, name: "rpm", unit: "rev/min", convertFunction: this.convertRPM(byteA, byteB)},
            ]
        }
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
                //return characteristic.writeValue(testArray);

                setInterval(function(){
                    return characteristic.writeValue(testArray);
                }, 3000);
            

                //var testArray = this.encodeCommand(obdCommand);
                // new Uint8Array([zero, one, two, three, four]);
                // test again with this textencoder, should work in theory
                // let message = encoder.encode("010C\r");
                // let message2 = encoder.encode("ATDP\r\n");
                // return characteristic.writeValue(testArray);
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
            var command = "010C1\r";
            var currentBufferDecoded = decoder.decode(value.buffer);
            var lastBufferDecoded = decoder.decode(this.lastBuffer);
            if ( lastBufferDecoded == command){
                this.setupDone = true;
            }
            // if(this.setupDone == true){
            //     console.log(currentBufferDecoded);
            //     this.pidResponse.push(value.buffer);
            //     if(lastBufferDecoded == "0C"){
            //         this.pidResponse[0] = decoder.decode(value.buffer);
            //     }
            //     if(lastBufferDecoded == this.pidResponse[0]){
            //         this.pidResponse[1] = decoder.decode(value.buffer);
            //         this.currentRPM = this.convertRPM(this.pidResponse[0], this.pidResponse[1]);
            //     }
            // }







            if(this.setupDone == true){
                console.log('yeet', currentBufferDecoded);
                if(currentBufferDecoded == "41"){
                    this.byteCounter = this.obdCommandInfo.bytes + 2;
                }
                if (this.byteCounter > 0){
                    this.pidResponse.push(currentBufferDecoded);
                    this.byteCounter--;
                    if(this.byteCounter == 0){
                    this.obdCommandInfo.convertFunction(this.pidResponse[3], this.pidResponse[4])
                    this.currentRPM = this.convertRPM(this.pidResponse[3], this.pidResponse[4]);
                    }
                }
            }
            this.lastBuffer = value.buffer;
            // var firstByte = value.buffer.getUint8(0);
            // try {
            //     var secondByte = value.buffer.getUint8(1);
            // } catch {
            //     var secondByte = null;
            // }
            // if (secondByte != null) {
            //     var reply = parseInt(firstByte + secondByte);
            // } else {
            //     var reply = parseInt(firstByte);
            // }

            // if (twoBytes) {
            //     byteB = reply;
            //     this.parseCommand();
            // }

            // if (commandAccepted) {
            //     numberOfBytes = obdCommandInfo.find(function(element) {
            //         return element.pid == currentCommand;
            //     });
            //     if (numberOfBytes == 1) {
            //         byteA = reply;
            //         this.parseCommand();
            //     } else {
            //         twoBytes = true;
            //     }
            // }

            // if (correctReply) {
            //     currentCommand = reply;
            //     commandAccepted = true;
            // }    
            // numberOfBytes = 0;
            // commandAccepted = false
            // correctReply = false;
            // twoBytes = false;

            // if (reply == 41) {
            //     correctReply = true;
            // }
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
