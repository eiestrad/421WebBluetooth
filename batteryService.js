let batteryLevel = document.querySelector("#batteryLevel");
let currentValue = 0;
let newValue = 1;

async function batteryDevices() {
	navigator.bluetooth
		.requestDevice({
			optionalServices: [0x180A, 0x180F, 0xFE2C, 0xFE03], acceptAllDevices: true
		})
		.then((device) => {
			console.log(device.name);
			return device.gatt.connect();
		})
		.then((server) => {
			return server.getPrimaryService("battery_service");
		})
		.then((service) => {
			return service.getCharacteristic("battery_level");
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
	batteryLevel.innerHTML = `&#x1F5F2 ${value.getUint8(0)}%`;
	// while (currentValue != newValue) {
	// 	await setTimeout(tickPercentage, 1000);
	// }
}

// function tickPercentage() {
//     console.log("tick");
// 	if (currentValue > newValue) {
// 		currentValue--;
// 		batteryLevel.innerHTML = `&#x1F5F2 ${currentValue}%`;
// 	} else {
// 		currentValue++;
// 		batteryLevel.innerHTML = `&#x1F5F2 ${currentValue}%`;
// 	}

//     return ;
// }
