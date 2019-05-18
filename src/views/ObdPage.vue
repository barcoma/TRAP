<template lang="html">
 <div class="obdbackground">
    <section class="OBD">
 

        <v-toolbar extension-height class="topbar"> 
      </v-toolbar>
      
      <h5>Fahrzeugdiagnose</h5>
      <sidebarmenu class="sidebarmenu"/>
       
    
     <!--<v-btn large round dark class=""><img src="../../public/img/icons/GrünerHaken.svg"></img><p style="justify-self:center; margin-left:15px;margin-bottom:0;">Alles gut</p></v-btn> -->
     <v-btn large round dark class=""><img style="width:40px;"src="../../public/img/icons/Danger.svg"></img><p style="justify-self:center; margin-left:15px;margin-bottom:0;">Werkstatt aufsuchen</p></v-btn>
     <div class="Grid">
      <div class="fensterobd">
        <img  class="fensterobdcontentimg" src="../../public/img/icons/Tankstand.svg">
        <p class="fensterobdcontenttext"> Tankstand: 60% </p>
       </div>
      <div class="fensterobd">
        <img  class="fensterobdcontentimg" src="../../public/img/icons/speedmeter.svg">
        <p class="fensterobdcontenttext"> Speed: 90km/h </p>
       </div>
      <div class="fensterobd">
        <img  class="fensterobdcontentimg" src="../../public/img/icons/statistics.svg">
        <p class="fensterobdcontenttext"> Verbrauch: 7l/100km</p>
       </div>
       <div class="fensterobd">
        <img  class="fensterobdcontentimg" src="../../public/img/icons/thermometer.svg">
        <p class="fensterobdcontenttext"> Außentemperatur: 24° </p>
       </div>
       </div>

    </section>
      </div>

</template>

<script>

import Sidebarmenu from '../components/Sidebarmenu.vue'

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
    name: "OBD",
    data() {
        
        return{
            currentRPM: "0",
            pidResponse: [],
            byteCounter: 0,
            obdCommandInfo: [
                {pid: "0C", bytes: 2, name: "rpm", unit: "rev/min", convertFunction: this.convertRPM(byteA, byteB)},
            ],
             }
        },
  data: () => ({
      cards: [
        { title: 'Tankstatus',  img: "../../public/img/icons/Tankstand.svg", flex: 6 },
        { title: 'Außentemperatur',flex: 6 },
        { title: 'Verbrauch',flex: 6 },
        { title: 'Geschwindigkeit', flex: 6 }
      ],
      
    }),
    
         
     /*
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
    }, */
    components:{
    Sidebarmenu
    },
} 
</script> 
<style lang="scss">

.obdbackground{
  background: url('../../public/img/backgroundobd.png') no-repeat center center fixed; 
  background-size: cover;
  height:100%;

}
.Obdcards{
 color: white;
 opacity: 0.5;
}

i.material-icons{
    margin: 0% 5%;
}
.sidebarmenu{
  z-index: 1000;
  opacity: 1;
}
div.layout.layoutOBD{
opacity: 0.7;
}
.headline.white--text{
  opacity:1;
  z-index: 10000;
}
.Grid{
  display: grid;
  grid-template-columns: 50% 50% ;
  grid-template-rows: 90% 90%;
  width: 100%;
  margin-top: 5%;
  height:180px;

}
.fensterobd{
  display: grid;
  grid-template-columns: 25% 50% 25%;
    border-radius: 10px;
  grid-template-rows: 20% 40% 40%;
   box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  margin: 5% 5%;
  opacity: 1;
}
.fensterobdcontentimg{
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  width:100%;
  height:35%;
  justify-self: center;

}
.fensterobdcontenttext{
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 3;
  grid-row-end: 3;
  margin-bottom:0%;
  justify-self: center;
}

button.v-btn.v-btn--large.v-btn--round.theme--dark{
  width: 300px;
  height: 96px;
  border-radius: 10px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  margin: 5% 0;
  opacity:1;
  color: black;
}
.topbar{
   // background: -moz-linear-gradient(-60deg, #4285f4 0%, #00ebff 100%); /* FF3.6-15 */
    //background: -webkit-linear-gradient(-60deg, #4285f4 0%,#00ebff 100%); /* Chrome10-25,Safari5.1-6 */
    //background: linear-gradient(135deg, #4285f4 0%,#00ebff 100%); 
    height:8%;
    width: 100%;
    opacity:0;
}
div.flex.xs12.align-end.flexbox{
    opacity:0.5;
    color: white;
    background-color: white;
}
div.v-card.theme--light.white{
  background-color: white;
  color: balck;
}
.obdicons{
  opacity: 1;
}
</style>
