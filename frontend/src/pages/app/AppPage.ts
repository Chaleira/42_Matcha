import { AnchorElement, BorderPaneElement, DivElement, RouteView } from 'typecomposer'
import { Api } from '@/api/Api';
import { userStore } from '@/store/UserStore';
import { io, Socket } from "socket.io-client";

export class AppPage extends BorderPaneElement {

	static socket: Socket = io("http://localhost:3000");

	constructor() {
		super({ height: "100vh", width: "100vw", backgroundColor: "#f0f0f0" });
	}

	onInit(): void {
		this.top = new DivElement({ height: "50px", backgroundColor: "#333", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" });
		this.top.append(new AnchorElement({ text: "Home", rlink: "#/home", color: "#fff", margin: "0 10px" }));
		this.top.append(new AnchorElement({ text: "Chat", rlink: "#/chat", color: "#fff", margin: "0 10px" }));
		this.center = new RouteView({ backgroundColor: "white", overflow: "hidden" });
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
		Api.User.update({ userLocation: userStore.value.userLocation })
	}



}