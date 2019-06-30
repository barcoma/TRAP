<template lang="html">
 <div class="obdbackground">
    
 
    <div class="ObdTop">
        <v-toolbar class="topbar"> 
      </v-toolbar>
      
      <h5 @click="testPopUp('Werkstatt aufsuchen!','P0524: Motoröldruck zu niedrig','yellow')">Fahrzeugdiagnose</h5>
      <!-- <sidebarmenu class="sidebarmenu"/> -->
    </div>   
    <div 
    class="ObdTopmid"
    @click="cycleButtons"
    >
     <v-btn v-if="infoIndex==0" large round dark class=""><img src="../../public/img/icons/GrünerHaken.svg"></img><p style="justify-self:center; margin-left:15px;margin-bottom:0;">Alles gut</p></v-btn>
     <v-btn v-if="infoIndex==1" large round dark class=""><img style="width:40px;"src="../../public/img/icons/mediumdanger.svg"></img><p style="justify-self:center; margin-left:15px;margin-bottom:0;">
       Werkstatt aufsuchen
       <br><span class="errorDescription">P0524: Motoröldruck zu niedrig</span>
        </p>
       </v-btn>
     <v-btn v-if="infoIndex==2" large round dark class=""><img style="width:40px;"src="../../public/img/icons/danger.svg"></img><p style="justify-self:center; margin-left:15px;margin-bottom:0;">
       Sofort anhalten!
       <br><span class="errorDescription">P0217: Motor-Überhitzung</span>
        </p>
       </v-btn>
     </div>


     <div class="Grid" v-if="!isConnected">
       <div class="connection-error-field">
         <h1 class="connection-error-header">Verbinde dich jetzt</h1>
         <p class="connection-error-text">Schließe deinen Adapter am OBD-Ausgang deines Autos an. <br>Drücke den Button und wähle deinen Adapter aus der Liste.</p>
         <v-btn
            color="blue-grey"
            class="connection-error-button"
            @click="startWorker"
          >
        <img src="../../public/img/icons/newCar.svg">
        </v-btn>
        <!-- <img  class="connection-error-icon" src="../../public/img/icons/btConnect.svg"> -->
       </div>
     </div>


     <div class="Grid" v-if="isConnected">
      <div class="fensterobdNEW">
        <v-icon color="#000" class="fensterobdcontentimgNEW" x-large>local_gas_station</v-icon>
        <p class="fensterobdcontenttext_value">60%</p>
        <p class="fensterobdcontenttextNEW"> Tankstand</p>
       </div>

      <div class="fensterobdNEW">
        <img  class="fensterobdcontentimgNEW" src="../../public/img/icons/speedometer.svg">
        <p class="fensterobdcontenttext_value">{{ obdCommandInfo[0].value }}</p>
        <p class="fensterobdcontenttextNEW"> Drehzahl</p>        
       </div>

       <div class="fensterobdNEW">
        <img  class="fensterobdcontentimgNEW" src="../../public/img/icons/oil_temperature.svg">
        <!-- <p  class="fensterobdcontenttext_unit">°</p> -->
        <p class="fensterobdcontenttext_value">89° </p>
        <p class="fensterobdcontenttextNEW"> Öltemperatur</p>
       </div>
       <div class="fensterobdNEW">
        <img  class="fensterobdcontentimgNEW" src="../../public/img/icons/coolant_temperature.svg">
        <!-- <p  class="fensterobdcontenttext_unit">°</p> -->
      <p class="fensterobdcontenttext_value">{{ obdCommandInfo[1].value }}° </p>
        <p class="fensterobdcontenttextNEW"> Kühlmitteltemperatur</p>
       </div>
       </div>

   
      </div>

</template>

<script>
import Sidebarmenu from '../components/Sidebarmenu.vue'
import {eventBus} from '../main.js';
import { OBDStatus, OBDCommands } from '../shared_data/queries'

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

export default {
    name: "OBDPage",
    data() {
        return{
            isConnected: OBDStatus.state.connected,
            writeDelay: 50,
            currentRPM: "0",
            pidResponse: [],
            byteCounter: 0,
            obdCommandInfo: OBDCommands,
            testCount: 0,
            lastBuffer: ArrayBuffer,
            queue: ["010C1\r", "01051\r"],
            lastCommandSent: String,
            replyBytes: Number,
            repliedCommand: null,
            infoIndex: 0,
            char: null
        }
    },
    computed: {

    },
    methods: {
        getDevices: function() {
            OBDStatus.setValue();
            this.isConnected = OBDStatus.state.connected
            eventBus.$emit('obdConnected', this.isConnected);
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
                this.char = characteristic     
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
                        var reply = this.convertValue(this.pidResponse, 'fuel');
                        this.updateValue(reply);
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
        },
        testPopUp: function(title, text, color){
          setTimeout(function () {
              eventBus.$emit('showPopUp', title, text, color);
          }, 5000);
        },
        cycleButtons: function(){
          if(this.infoIndex == 2){
            this.infoIndex = 0;
          } else {
            this.infoIndex++;
          }
        },
        updateValue: function(newValue){
          var pid = this.repliedCommand.service;
          var index = this.obdCommandInfo.findIndex(obd => obd.service == pid);
          this.obdCommandInfo[index].value = newValue;
        },
        closeBTConnection: function(){
          if (this.char) {
            this.char.stopNotifications()
            .then(_ => {
              log('> Notifications stopped');
              this.char.removeEventListener('characteristicvaluechanged',
                  this.handleCharacteristicValueChanged);
            })
            .catch(error => {
              log('Argh! ' + error);
            });
          }
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
<style lang="scss">

.obdbackground{
  background: url('../../public/img/backgroundobd.png') no-repeat center center fixed; 
  background-size: cover;
  height:100%;
  display:grid;
  grid-template-columns: 100%;
  grid-template-rows:10% 20% 50% 20%;
}
.ObdTopmid{
grid-row-start:2;
grid-row-end:3;
height:100%;
display:grid;
grid-template-columns: 5% 90% 5%;
  button{
    margin: 0;
  }
}
.Obdcards{
 color: white;
 opacity: 0.5;
}
.ObdTop{
grid-row-start: 1;
grid-row-end: 2;
height:100%;
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
  grid-template-rows: 50% 50%;
  grid-row-start: 3;
  grid-row-end: 4;
  width: 100%;
  margin-top: 2%;
  height:100%;

}

///OLD
.fensterobd{
  display: grid;
  grid-template-columns: 25% 50% 25%;
    border-radius: 10px;
  grid-template-rows: 20% 40% 40%;
   box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  margin: 5% 5%;
  opacity: 1;
  height: 90%;
}
.fensterobdcontentimg{
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  width:100%;
  height:90%;
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

//NEW
.fensterobdNEW{
  display: grid;
  grid-template-columns: 35% 65%;
  border-radius: 10px;
  grid-template-rows: 25% 25% 25% 25%;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  //background-color: rgba(255, 255, 255, 0.95);
  background-image: linear-gradient(120deg, #ffffff 0%, #fdfdfd 100%);
  margin: 10% 5% 10% 10%;
  opacity: 1;
  height: 90%;
}

.fensterobdNEW:nth-of-type(2n){
    margin: 10% 10% 10% 5%;
}

.fensterobdcontentimgNEW{
  grid-column-start: 1;
  grid-column-end: 1;
  grid-row-start: 1;
  grid-row-end: 3;
  width:100%;
  height:60%;
  justify-self: center;
  align-self: end;
}

.fensterobdcontenttextNEW{
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 4;
  grid-row-end: 4;
  margin-bottom:0%;
  justify-self: center;
  align-self: center;
}
.fensterobdcontenttext_value{
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 4;
  margin-bottom:0%;
  justify-self: center;
  align-self: center;
  font-size: 3em;
  color: #000;
  font-weight: 800;
  margin-right: .4em;
}

.fensterobdcontenttext_unit{
    font-size: 2em;
    grid-column-start: 3;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 3;
    width:100%;
    height:40%;
    justify-self: center;
    align-self: end;
  }

  //CONNECTION ERROR
  .connection-error-field{
    display: grid;
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
    grid-template-columns: 10% 80% 10%;
    border-radius: 10px;
    grid-template-rows: 30% 40% 30%;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    background-color: rgba(32, 141, 204, 0.631);
    opacity: 1;
    height: 100%;
    width: 90%;
    justify-self: center;
   }

  .connection-error-text{
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 2;
    height: 80%;
    width:100%;
    justify-self: center;
    align-self: center;
    color: #fff;
    font-size: 1.1em;
    text-align: left;
  }
  .connection-error-header{
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 1;
    height: 80%;
    width:100%;
    justify-self: center;
    align-self: end;
    line-height: 2;
    font-size: 1.7em;
  }

  .connection-error-button{
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row-start: 3;
    grid-row-end: 3;
    width:100%;
    height:70% !important;
    justify-self: center;
    align-self: center;
    margin: 0 !important;
    padding: 0 !important;
    .v-btn__content{
      height: 100%;
    }
    img{
      object-fit: contain;
      max-height: 60%;
      height: auto;
      width: 80%;
    }
  }





button.v-btn.v-btn--large.v-btn--round.theme--dark{
  height: 80%;
  border-radius: 10px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  margin-top: 5%;
  opacity:1;
  color: black;
  grid-column-start: 2;
  grid-column-end:3;
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

.errorDescription{
  font-size: .7em;
  color: #505050;
}

</style>
