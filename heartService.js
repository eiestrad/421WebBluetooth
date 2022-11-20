let heartRate = document.querySelector("#statusReport");

async function heartDevices() {
    heartRate.innerHTML = `&#x2764 0`
    navigator.bluetooth.requestDevice({
        filters: [{
            services: ['heart_rate'],
        }]
    })
    .then(device => {
        console.log(`Connected to '${device.name}'`);
        return device.gatt.connect();})
    .then(server => {
        return server.getPrimaryService('heart_rate');
    })
    .then(service => {
        console.log(service);
        return service.getCharacteristic('heart_rate_measurement');
    })
    .then(characteristic => {
        console.log(characteristic);
        characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged',
                                        heartRateChanged);
        // return characteristic.readValue()
    })
    .catch(error => { console.error(error);});
}

async function heartRateChanged(event) {
    const value = event.target.value;
    parseHeartRate(value);
}

async function parseHeartRate(heartRateValue) {
    console.log(heartRateValue)
    heartRateValue = heartRateValue.buffer ? heartRateValue : new DataView(heartRateValue);
    console.log(`> Heart Rate is ${heartRateValue.getUint8(1)}`);
    heartRate.innerHTML = `&#x2764 ${heartRateValue.getUint8(1)}`;
}