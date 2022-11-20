let batteryLevel = document.querySelector("#batteryLevel");
let readyState = document.querySelector("#readyState");
let currentValue = 0;
let newValue = 1;

async function batteryDevices() {
	navigator.bluetooth
		.requestDevice({
			optionalServices: [0x180A, 0x180F, 0x9800], acceptAllDevices: true
		})
		.then((device) => {
			console.log(device.name);
			return device.gatt.connect();
		})
		.then((server) => {
			return server.getPrimaryService(0x9800);
		})
		.then((service) => {
			return service.getCharacteristic(0x9801);
		})
		.then((characteristic) => {
			characteristic.startNotifications();
			characteristic.addEventListener(
				"characteristicvaluechanged",
				characteristicValueChanged
			);
			return characteristic.readValue();
		})
		.catch((error) => {
			console.error(error);
		});
}

function characteristicValueChanged(event) {
	const value = event.target.value;
	parseBatteryData(value);
}

async function parseBatteryData(value) {
	value = value.buffer ? value : new DataView(value);
	this.newValue = Number.parseInt(value.getUint8(0));
	console.log(`> Battery Level: ${value.getUint8(0)}`);
	readyState.innerHTML = "Ready";
	batteryLevel.innerHTML = `${value.getUint8(0)}`;
}
