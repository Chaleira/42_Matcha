import { ButtonElement, Component, DivElement, HBoxElement, ImageElement, ListElement, ref, SpanElement, TextFieldElement, VBoxElement } from "typecomposer";
import { AppPage } from "../../pages/app/AppPage";
import { IMessage } from "../../api/Interfaces";
import { userStore } from "../../store/UserStore";



class UserMessageView extends Component {

	constructor(user: { firstName: string, avatar?: string }, chatId: string) {
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
		const vbox = this.appendChild(new VBoxElement({ gap: "5px", padding: "5px", width: "100%" }));
		vbox.append(new SpanElement({ text: user.firstName || "name" }));
		const hbox = vbox.appendChild(new HBoxElement({ gap: "5px" }));
		hbox.append(new SpanElement({ text: "👤", title: "Profile", className: "btn" }));
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


class MessageItem extends Component {

	constructor(message: IMessage) {
		super({ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "15px", borderRadius: "5px", backgroundColor: "#f0f0f0", marginBottom: "5px" });
		this.append(new SpanElement({ text: message.content }));
	}
}

export class ChatView extends Component {

	private listUsers = new ListElement({ width: "100%" });
	private listMessages = new ListElement({ className: "message-list", width: "100%", padding: "20px" });
	private sendButton = new ButtonElement({ width: "18%", height: "55px", backgroundColor: "blue", color: "white", text: "Send", marginBottom: "5px" });
	private textField = new TextFieldElement({ placeholder: "Type a message", height: "59px", color: "black", placeholderAnimation: false, width: "80%", margin: "auto" });
	private backgroundImage = ref<string>("")

	constructor() {
		super({ display: "flex", width: "100vw", height: "100vh", overflowX: "hidden", overflowY: "auto", flexDirection: "row" });
		const left = new DivElement({ width: "300px", backgroundColor: "#f0f0f0", overflow: "hidden", height: "calc(100% - 50px)" });
		left.append(this.listUsers);
		const center = new DivElement({
			overflow: "hidden",
			width: "calc(100% - 300px)",
			height: "calc(100% - 50px)",
			padding: "10px",
			display: "grid", gridTemplateRows: "1fr auto",

		});
		AppPage.socket.on("joinRoom", (chat) => {
			if (chat == undefined) {
				alert("Chat not found");
				return;
			}
			console.log("joinRoom", chat);
			this.updateMessages(chat.messages);
			this.sendButton.onclick = () => {
				console.log("send", chat._id, " / ", userStore.value._id, " / ", this.textField.value.toString());
				AppPage.socket.emit("message", chat._id, userStore.value._id, this.textField.value.toString());
			}
		});

		AppPage.socket.on("message", (chat) => {
			console.log("message", chat);
		});


		for (let i = 0; i < 10; i++)
			this.listUsers.addItem(new UserMessageView({
				firstName: "User " + i,
			}, "66f44ce9c55a5333fb682ad6"));
		const hbox = new HBoxElement({ gap: "10px", alignItems: "center" });
		hbox.append(this.textField, this.sendButton);
		const textArea = new DivElement({
			width: "100%", overflow: "hidden", marginBottom: "15px",
			border: "1px solid #ccc", borderRadius: "5px",
			backgroundImage: this.backgroundImage,
			backgroundSize: "cover",
			backgroundPosition: "center",
		});
		textArea.append(this.listMessages);
		center.append(textArea, hbox);
		this.append(left, center);
		this.updateMessages(undefined);
	}

	private addMessage(message: IMessage) {
		const item = this.listMessages.addItem(new MessageItem(message));
		item.style.margin = "10px";
		const ul = item.parentElement;
		if (ul)
			ul.style.justifyContent = message.sender == userStore.value._id?.toString() ? "flex-end" : "flex-start";
	}

	private updateMessages(messages: IMessage[] | undefined) {
		if (messages == undefined) {
			this.backgroundImage.value = "url('/assets/image/5311272-conceito-de-relacionamento-virtual-namoro-on-line-e-rede-social-com-pessoas-procurando-por-um-relacionamento-romantico-atraves-de-seu-dispositivo-aplicativo-de-namoro-online-e-mensageiro-estilo-plano-ilustracaoial-vetor.jpg')";
		}
		else {
			this.backgroundImage.value = "";
		}
		this.listMessages.removeItems();
		if (messages)
			for (const message of messages) {
				this.addMessage(message);


			}
		console.log("messages: ", messages);
	}


}