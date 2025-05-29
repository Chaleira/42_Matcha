import { AlertPanel, AnchorElement, App, BorderPanel, DivElement, Router, RouteView } from 'typecomposer'
import { Api } from '@/api/Api';
import { userStore } from '@/store/UserStore';
import { io, Socket } from "socket.io-client";

export class AppPage extends BorderPanel {

	static #socket: Socket | null = null;
	static userStatus = new Map<string, boolean>();
	static get socket(): Socket {
		if (!AppPage.#socket) {
			if (!(import.meta.env.VITE_PRODUCTION === "true")) {
			AppPage.#socket = io(
				"http://localhost:3000"
				, {
					extraHeaders: {
						"token": localStorage.getItem("token") || "",
					}
				});
			}
			else {
				AppPage.#socket = io({
						path: "/socket.io",
						extraHeaders: {
							"token": localStorage.getItem("token") || "",
						}
					});
			}
		}
		return AppPage.#socket;
	}

	constructor() {
		super({ height: "100vh", width: "100vw", backgroundColor: "#f0f0f0" });
		this.top = new DivElement({ className: "app-top", height: "50px", backgroundColor: "#333", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" });
		this.top.append(new AnchorElement({ text: "Home", rlink: "home", color: "#fff", margin: "0 10px" }));
		this.top.append(new AnchorElement({ text: "Chat", rlink: "chat", color: "#fff", margin: "0 10px" }));
		this.top.append(new AnchorElement({ text: "Profile", rlink: "profile?id=" + userStore.value.user_id, color: "#fff", margin: "0 10px" }));
		this.top.append(new AnchorElement({ text: "Notifications", rlink: "notifications", color: "#fff", margin: "0 10px" }));
		this.top.append(new AnchorElement({
			text: "Logout", href: "#", onclick: () => {
				Api.User.logout();
				Router.go("login");
			}, color: "#fff", margin: "0 10px"
		}));
		this.center = new RouteView({ backgroundColor: "white", overflow: "hidden" });
	}

	onConnected(): void {
		this.getUserLocation();
		AppPage.socket.off("notification");
		AppPage.socket.off("user-connected");
		// notification
		AppPage.socket.on("notification", (data: any) => {
			AlertPanel.info(data.content)
		});
		AppPage.socket.on("user-connected", (data: {
			userId
			: string
		}[]) => {
			AppPage.userStatus.clear();
			for (const user of data) {
				AppPage.userStatus.set(user.userId.toString(), true);
			}
			setTimeout(() => this.emitEvent("user-connected", data), 0);
		});
		AppPage.#socket?.emit("user-status");
	}

	onDisconnected(): void {
		this.emitEvent("disconnect");
		AppPage.socket.off("notification");
		AppPage.socket.off("user-connected");
		AppPage.socket.off("user-connected");

	}

	getUserLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.updateLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
			}, () => {
				fetch('https://ipapi.co/json/', {
					credentials: "omit"
				})
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
		userStore.value.latitude = location.latitude;
		userStore.value.longitude = location.longitude
		Api.User.update({
			latitude: location.latitude,
			longitude: location.longitude,
		})
	}

}