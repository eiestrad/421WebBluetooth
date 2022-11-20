let inputValue = document.querySelector("#inputValue");
let readyState = document.querySelector("#readyState");
let currentValue = 0;
let newValue = 1;

async function inputDevices() {
	navigator.bluetooth
		.requestDevice({
			optionalServices: [0x180A, 0x180F, 0x9800], acceptAllDevices: true
		})
		.then((device) => {
			console.log(device.name);
			return device.gatt.connect();
		})
		.then((server) => {
			//console.log(server.getPrimaryService(0x9800));
			return server.getPrimaryService(0x9800);
		})
		.then((service) => {
			//console.log(service.getCharacteristic(0x9801));
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
	parseInputData(value);
}

async function parseInputData(value) {
	value = value.buffer ? value : new DataView(value);
	this.newValue = Number.parseInt(value.getUint8(0));
	console.log(`> Input: ${value.getUint8(0)}`);
	readyState.innerHTML = "Ready";
	inputValue.innerHTML = `${value.getUint8(0)}`;
}
