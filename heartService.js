async function heartDevices() {
    navigator.bluetooth.requestDevice({
        optionalServices: [0x180A, 0x180F], acceptAllDevices: true
    })
        .then(device => {
            console.log(`Connected to '${device.name}'`);
            return device.gatt.connect();
        })
        .then(server => {
            return server.getPrimaryService('heart_rate');
        })
        .then(service => {
            return service.getCharacteristic('heart_rate_measurement');
        })
        .then(characteristic => {
            return characteristic.readValue();
        })
        .catch(error => { console.error(error); });
}

// function characteristicValueChanged(event) {
//     const value = event.target.value;
//     parseHeartRate(value);
// }

function parseHeartRate(value) {
    value = value.buffer ? value : new DataView(value);
    console.log(`> Battery Level is ${value.getUint8(0)}%`);
}