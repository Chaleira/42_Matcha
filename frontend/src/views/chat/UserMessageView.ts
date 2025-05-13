import { IChat } from "@/api/Interfaces";
import { AppPage } from "@/pages/app/AppPage";
import { Component, ImageElement, VBox, SpanElement, HBox, Router } from "typecomposer";


export class UserMessageView extends Component {

	constructor(chat: IChat) {
		super({
			className: "user-message-view",
		});

		const avatar = this.appendChild(new ImageElement({
			width: "70px",
			height: "50px",
			borderRadius: "50%",
			marginRight: "10px"
		}));
		avatar.src = chat.avatar || "/assets/image/istockphoto-1337144146-612x612.jpg";
		const vbox = this.appendChild(new VBox({ gap: "5px", padding: "5px", width: "100%" }));
		vbox.append(new SpanElement({ text: chat.first_name || "name" }));
		const hbox = vbox.appendChild(new HBox({ gap: "5px" }));
		hbox.append(new SpanElement({ text: "👤", title: "Profile", className: "btn", onclick: () => Router.go("profile", { id: chat.user2_id }) }));
		hbox.append(new SpanElement({ text: "🚫", title: "Block", className: "btn" }));
		hbox.append(new SpanElement({ text: "🗑️", title: "Delete Messages", className: "btn" }));
		hbox.append(new SpanElement({ text: "🚨", title: "Report", className: "btn" }));
		this.append(new ImageElement({
			className: "btn-send",
			src: "/assets/image/3a5a47d3b92c53c060da34a2294453e3.jpg",
			onclick: () => {
				console.log("send", chat.user2_id, " / ", chat.user1_id, " / ", chat.id);
				AppPage.socket.emit("join", { chat_id: chat.id })
			}
		}));
	}
}

