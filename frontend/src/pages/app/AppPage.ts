import { BorderPaneElement, DivElement, RouteView } from 'typecomposer'
import { Api } from '../../api/Api';
import { userStore } from '../../store/UserStore';

export class AppPage extends BorderPaneElement {

	constructor() {
		super({ height: "100vh", width: "100vw", backgroundColor: "#f0f0f0" });
	}

	onInit(): void {
		this.top = new DivElement({ height: "50px", backgroundColor: "#333", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" });
		this.center = new RouteView({ width: "auto%", height: "calc(100vh)", backgroundColor: "white", overflowY: "auto", overflowX: "hidden" });
	}

	onConnected(): void {
		this.getUserLocation();
	}

	getUserLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.updateLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
			}, () => {
				fetch('https://ipapi.co/json/')
					.then(response => response.json())
					.then(data => {
						const latitude = data.latitude;
						const longitude = data.longitude;
						this.updateLocation({ latitude, longitude });
					})
					.catch(error => console.error('Error fetching IP location:', error));
			});
		} else {
			console.log("Geolocation is not supported by this browser.");
			fetch('https://ipapi.co/json/')
				.then(response => response.json())
				.then(data => {
					const latitude = data.latitude;
					const longitude = data.longitude;
					this.updateLocation({ latitude, longitude });
				})
				.catch(error => console.error('Error fetching IP location:', error));
		}
	}

	updateLocation(location: { latitude: number, longitude: number }) {
		userStore.value.userLocation.coordinates[0] = location.latitude;
		userStore.value.userLocation.coordinates[1] = location.longitude
		console.log(`Latitude: ${location.latitude}, Longitude: ${location.longitude}`);
		Api.User.update({ userLocation: userStore.value.userLocation })
	}



}