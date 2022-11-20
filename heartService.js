let currentVal = 0;
let newVal = 1;

async function heartDevices() {
    navigator.bluetooth.requestDevice({
        optionalServices: [0x180E, 0x180D], acceptAllDevices: true
    })
        .then(device => {
            console.log(`Connected to '${device.name}'`);
            return device.gatt.connect();
        })
        .then(server => {
            console.log(server.getPrimaryService(0x180E));
            return server.getPrimaryService(0x180E);/*
            return server.getPrimaryService(0x180D);
            return server.getPrimaryService('heart_rate');*/
        })
        .then(service => {
            console.log(service.getCharacteristic(0x2A3F));
            return service.getCharacteristic(0x2A3F);/*
            return service.getCharacteristic(0x2A37);
            return service.getCharacteristic('heart_rate_measurement');*/
        })
        .then((characteristic) => {
            characteristic.startNotifications();
            characteristic.addEventListener(
                "characteristicvaluechangedH",
                characteristicValueChangedH
            );
            return characteristic.readValue();
        })
        .catch((error) => {
            console.error(error);
        });
}

function characteristicValueChangedH(event) {
    const value = event.target.value;
    parseHeartData(value);
}

async function parseHeartData(value) {
    value = value.buffer ? value : new DataView(value);
    //this.newVal = Number.parseInt(value.getUint8(0));
    //console.log(`> Battery Level: ${value.getUint8(0)}`);
    readyState.innerHTML = "Ready";
    //heartRate.innerHTML = `${value.getUint8(0)}`;
    heartRate.innerHTML = value;
}