import { Component, DropDown, H2Element, H4Element, HBox, ListItemElement, ListPanel, ref } from "typecomposer";
import { INotification } from "@/api/Interfaces";
import { Api } from "@/api/Api";
import { CustomCheckbox } from "@/components/CustomCheckbox";

class NotificationItem extends ListItemElement {

	static color = {
		match: "rgb(239 255 239)",
		unlike: "rgb(255 218 218)",
		visit: "rgb(210 210 255)",
		message: "rgb(251 251 232)",
		like: "rgb(241 214 241)"
	}

	static boderColor = {
		match: "#00FF00",
		unlike: "#FF0000",
		visit: "rgb(121 121 223)",
		message: "#FFFF00",
		like: "#FF00FF"
	}

	constructor(notification: INotification) {
		super({
			width: "100%", height: "auto", padding: "15px", backgroundColor: NotificationItem.color[notification.type], margin: "5px 0", borderRadius: "10px",
			border: "1px solid " + NotificationItem.boderColor[notification.type],
			overflow: "hidden",
			className: "notification-item",
		});
		this.append(new H2Element({ text: notification.content, fontSize: "20px", fontWeight: "bold", textAlign: "center" }));
		this.append(new H4Element({
			text: this.formatDate(notification.created_at!), fontWeight: "bold", textAlign: "center"
		}));
		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					console.log('Elemento visível!');
					// Você pode executar qualquer ação aqui
					observer.unobserve(entry.target); // Opcional: parar de observar depois de visível
				}
			});
		});

		observer.observe(this);

	}

	formatDate(date: string) {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		};
		const dateObj = new Date(date);
		return dateObj.toLocaleDateString('en-US', options);
	}
}


export default class NotificationsView extends Component {

	listNotifications: ListPanel<NotificationItem>;
	notifications: INotification[] = [];
	filter = ref({
		match: true,
		unlike: true,
		visit: true,
		message: true,
		like: true,
	})


	constructor() {
		super({ display: "flex", width: "100vw", height: "100vh", overflowX: "hidden", overflowY: "auto", flexDirection: "column" });
		this.append(new HBox({
			gap: "10px", padding: "20px", width: "100%", alignItems: "center", paddingBottom: "4px",
			children: [
				new CustomCheckbox("match", this.filter.value.match),
				new CustomCheckbox("unlike", this.filter.value.unlike),
				new CustomCheckbox("visit", this.filter.value.visit),
				new CustomCheckbox("message", this.filter.value.message),
				new CustomCheckbox("like", this.filter.value.like),
				new DropDown({
					value: "all",
					placeholder: "seen",
					options: ["all", "seen", "unseen"],
					onchange: (e: any) => {
						const value = e.target.value;
						console.log("Filter by seen:", value);
					}
				})
			]
		}));
		this.listNotifications = new ListPanel<NotificationItem>({ gap: "15px", padding: "20px", marginBottom: "2rem" });
		this.append(this.listNotifications);
		this.filter.subscribe(() => this.listenNotifications())
		Api.Notification.list().then((notifications: INotification[]) => { this.notifications = notifications; this.listenNotifications(); })

	}

	async listenNotifications() {
		this.listNotifications.removeItems();
		console.log("Notifications:", this.notifications);
		this.notifications.filter(e => {
			return this.filter.value[e.type].value;
		}).forEach((notification) => this.listNotifications.addItem(new NotificationItem(notification)));
	}
}