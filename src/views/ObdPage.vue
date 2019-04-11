<template lang="html">
    <section class="OBD">
        <button v-on:click="getDevices">Request devices</button>
    </section>
</template>

<script>
var serviceUUID = "e7810a71-73ae-499d-8c15-faa9aef0c3f2";
var charUUID = "bef8d6c9-9c21-4c9e-b632-bd58c1009f9f";
var byteA;
var byteB;
var currentCommand;
var correctReply = false;
var commandAccepted = false;
var numberOfBytes;
var twoBytes = false;

var obdCommandInfo = [
    {pid: "0C", bytes: 2, name: "rpm", unit: "rev/min", convertFunction: this.convertRPM},
]

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
            .then(characteristic => characteristic.startNotifications())
            .then(characteristic => {
                let encoder = new TextEncoder('utf-8');
                var commands = [];
                commands.push(encoder.encode("ATD\r\n"))
                commands.push(encoder.encode("ATZ\r\n"))
                commands.push(encoder.encode("ATE0\r\n"))
                commands.push(encoder.encode("ATL0\r\n"));
                commands.push(encoder.encode("ATS0\r\n"));
                commands.push(encoder.encode("ATH0\r\n"));
                commands.push(encoder.encode("ATSP0\r\n"));

                this.sendCommands(characteristic, commands);

                characteristic.addEventListener('characteristicvaluechanged',
                this.handleCharacteristicValueChanged);

                var obdCommand = "010C\r";
                var testArray = this.encodeCommand(obdCommand);
                // new Uint8Array([zero, one, two, three, four]);
                // test again with this textencoder, should work in theory
                let message = encoder.encode("010C\r");
                let message2 = encoder.encode("ATDP\r\n");
                return characteristic.writeValue(testArray);
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
            console.log('Received ' + value.buffer);
            var firstByte = value.buffer.getUint8(0);
            try {
                var secondByte = value.buffer.getUint8(1);
            } catch {
                var secondByte = null;
            }
            if (secondByte != null) {
                var reply = parseInt(firstByte + secondByte);
            } else {
                var reply = parseInt(firstByte);
            }

            if (twoBytes) {
                byteB = reply;
                this.parseCommand();
            }

            if (commandAccepted) {
                numberOfBytes = obdCommandInfo.find(function(element) {
                    return element.pid == currentCommand;
                });
                if (numberOfBytes == 1) {
                    byteA = reply;
                    this.parseCommand();
                } else {
                    twoBytes = true;
                }
            }

            if (correctReply) {
                currentCommand = reply;
                commandAccepted = true;
            }    
            numberOfBytes = 0;
            commandAccepted = false
            correctReply = false;
            twoBytes = false;

            if (reply == 41) {
                correctReply = true;
            }
        },
        sleep: function(delay) {
            var start = new Date().getTime();
            while (new Date().getTime() < start + delay);
        },    
        sendCommands: function(char, commands) {
            let encoder = new TextEncoder('utf-8');

            // maybe improved sleep function, needs testing
            const sleep = (delay) => {
                return new Promise(resolve => setTimeout(resolve, delay))
            }

            var i = 0;
            while(i < commands.length)
            {
                sleep(500).then(() => {
                    characteristic.writeValue(commands[i]);
                    i++;
                })
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
        parseCommand: function() {
            var callFunction = obdCommandInfo.find(function(element) {
                return element == currentCommand;
            });
            callFunction.convertFunction;
        },
        convertRPM: function() {
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