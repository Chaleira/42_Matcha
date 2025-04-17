import { AppPage } from "@/pages/app/AppPage";
import { Component, ImageElement, VBox, SpanElement, HBox, Router } from "typecomposer";


export class UserMessageView extends Component {

	constructor(user: { firstName: string, avatar?: string, userId: string }, chatId: string) {
		super({
			className: "user-message-view",
		});

		const avatar = this.appendChild(new ImageElement({
			width: "70px",
			height: "50px",
			borderRadius: "50%",
			marginRight: "10px"
		}));
		avatar.src = user.avatar || "/assets/image/istockphoto-1337144146-612x612.jpg";
		const vbox = this.appendChild(new VBox({ gap: "5px", padding: "5px", width: "100%" }));
		vbox.append(new SpanElement({ text: user.firstName || "name" }));
		const hbox = vbox.appendChild(new HBox({ gap: "5px" }));
		hbox.append(new SpanElement({ text: "👤", title: "Profile", className: "btn", onclick: () => Router.go("profile", { id: user.userId }) }));
		hbox.append(new SpanElement({ text: "🚫", title: "Block", className: "btn" }));
		hbox.append(new SpanElement({ text: "🗑️", title: "Delete Messages", className: "btn" }));
		hbox.append(new SpanElement({ text: "🚨", title: "Report", className: "btn" }));
		this.append(new ImageElement({
			className: "btn-send",
			src: "/assets/image/3a5a47d3b92c53c060da34a2294453e3.jpg",
			onclick: () => AppPage.socket.emit("joinRoom", chatId)
		}));
	}
}

