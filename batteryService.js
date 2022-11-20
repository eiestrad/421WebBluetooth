let batteryLevel = document.querySelector("#statusReport");
let currentValue = 0;
let newValue = 1;

/**
 * Search for and obtains bluetooth devices. Specifically, any devices that
 * the 'battery_service' service.
 */
async function batteryDevices() {
	batteryLevel.innerHTML = `&#x1F5F2 0%`
	navigator.bluetooth
		.requestDevice({
			filters: [
				{
					services: ["battery_service"],
				},
			],
		}) //Here we start all the promise chains to obtain the required information
		.then((device) => {
			//Logs the device name and connects to the devices GATT server
			console.log(device.name);
			return device.gatt.connect();
		})
		.then((server) => {
			//Afterwards it obtains the information regarding the battery service
			return server.getPrimaryService("battery_service");
		})
		.then((service) => {
			//Once we hall all the service details, we access the specific battery_level characteristic
			return service.getCharacteristic("battery_level");
		})
		.then((characteristic) => {
			//Once we get the characteristic, we start notificiations to notify when the value changes
			characteristic.startNotifications();
			characteristic.addEventListener(
				//We use an event listener and pass the new characteristic values which will have to be parsed
				"characteristicvaluechanged",
				batteryValueChanged
			);
			return characteristic.readValue();
		})
		.catch((error) => {
			console.error(error);
		});
}

/**
 * Event handler to parse through data and update the index.html
 */
function batteryValueChanged(event) {
	const value = event.target.value;
	parseBatteryData(value);
}

/**
 * Parses through the data to obtain the 'battery_leve'
 * Uses DOM manipulation to update the number on the screen
 */
async function parseBatteryData(value) {
	value = value.buffer ? value : new DataView(value);
	this.newValue = Number.parseInt(value.getUint8(0));
	console.log(`> Battery Level: ${value.getUint8(0)}`);
	batteryLevel.innerHTML = `&#x1F5F2 ${value.getUint8(0)}%`;
	// while (currentValue != newValue) {
	// 	await setTimeout(tickPercentage, 1000);
	// }
}

/**
 * Function that attemped to tick down and up the battery percentage smoothly
 * Did not work so commented out.
 */
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
