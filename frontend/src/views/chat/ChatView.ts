import { ButtonElement, Component, DivElement, HBox, ListPanel, ref, Router, TextField } from "typecomposer";
import { AppPage } from "@/pages/app/AppPage";
import { IMessage } from "@/api/Interfaces";
import { userStore } from "@/store/UserStore";
import { Api } from "@/api/Api";
import { MessageItem } from "./MessageItem";
import { UserMessageView } from "./UserMessageView";

export class ChatView extends Component {

	private listUsers = new ListPanel({ width: "100%" });
	private listMessages = new ListPanel({ className: "message-list", width: "100%" });
	private sendButton = new ButtonElement({ className: "message-input", width: "18%", height: "55px", backgroundColor: "blue", color: "white", text: "Send", marginBottom: "5px" });
	private textField = new TextField({ className: "message-input", placeholder: "Type a message", height: "59px", color: "black", placeholderAnimation: false, width: "100%", margin: "auto" });
	private backgroundImage = ref<string>("")

	constructor() {
		super({ display: "flex", width: "100vw", height: "100vh", overflowX: "hidden", overflowY: "auto", flexDirection: "row" });
		const left = new DivElement({ className: "list-users", width: "300px", backgroundColor: "#f0f0f0", overflow: "hidden", height: "calc(100% - 50px)" });
		left.append(this.listUsers);
		const center = new DivElement({
			overflow: "hidden",
			width: "calc(100% - 300px)",
			height: "calc(100% - 50px)",
			padding: "10px",
			display: "grid", gridTemplateRows: "1fr auto",
			className: "message-div",

		});
		AppPage.socket.on("joinRoom", (chat) => {
			if (chat == undefined) {
				alert("Chat not found");
				return;
			}
			left.classList.remove("open");
			console.log("joinRoom", chat);
			this.updateMessages(chat.messages);
			this.sendButton.onclick = () => {
				console.log("send", chat.user_id, " / ", userStore.value.user_id, " / ", this.textField.value.toString());
				AppPage.socket.emit("message", chat.user_id, userStore.value.user_id, this.textField.value.toString());
			}
		});

		AppPage.socket.on("message", (chat) => {
			console.log("message", chat);
			this.addMessage(chat);
			this.textField.value = "";
		});

		const hbox = new HBox({ gap: "10px", alignItems: "center" });
		hbox.append(this.textField, this.sendButton);
		const textArea = new DivElement({
			width: "100%", overflow: "hidden", marginBottom: "15px",
			border: "1px solid #ccc", borderRadius: "5px",
			display: "flex",
			backgroundImage: this.backgroundImage,
			backgroundSize: "cover",
			backgroundPosition: "center",
		});
		textArea.append(this.listMessages);
		center.append(textArea, hbox);
		this.append(left, center);
		this.updateMessages(undefined);
		this.append(new DivElement({
			className: "btn-chat-minimize", position: "fixed", width: "20px", text: "=", onclick: () => {
				left.classList.toggle("open");
			}
		}));
	}

	onDisconnected(): void {
		AppPage.socket.off("message");
		AppPage.socket.off("joinRoom");
		console.log("disconnected");
	}

	async onConnected() {
		const items = await Api.Chat.list(userStore.value.user_id || "") || [];
		this.listUsers.removeItems();
		for (const item of items) {
			if (userStore.value.blocked.find(e => e == item.userId) != undefined) continue;
			this.listUsers.addItem(new UserMessageView({
				firstName: item.title,
				avatar: item.icon,
				userId: item.userId
			}, item.user_id
			));
		}
		const id = Router.props.id;
		if (id) {
			const { messages } = await Api.Chat.get(id);
			this.updateMessages(messages || []);

		}
	}

	private addMessage(message: IMessage) {
		const item = this.listMessages.addItem(new MessageItem(message));
		item.style.margin = "10px";
		this.listMessages.scrollToBottom();
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
