async function heartDevices() {
    navigator.bluetooth.requestDevice({
        optionalServices: [0x180E, 0x180D], acceptAllDevices: true
    })
        .then(device => {
            console.log(`Connected to '${device.name}'`);
            return device.gatt.connect();
        })
        .then(server => {
            return server.getPrimaryService(0x180E);
            return server.getPrimaryService(0x180D);
            return server.getPrimaryService('heart_rate');
        })
        .then(service => {
            return service.getCharacteristic(0x2A3F);
            return service.getCharacteristic(0x2A37);
            return service.getCharacteristic('heart_rate_measurement');
        })
        .then(characteristic => {
            return characteristic.readValue();
        })
        .catch(error => { console.error(error); });
}

function parseHeartRate(value) {
    value = value.buffer ? value : new DataView(value);
    console.log(`> Battery Level is ${value.getUint8(0)}%`);
}