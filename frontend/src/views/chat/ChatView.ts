import { ButtonElement, Component, DivElement, HBox, ListPanel, ref, Router, TextField } from "typecomposer";
import { AppPage } from "@/pages/app/AppPage";
import { IMessage } from "@/api/Interfaces";
import { userStore } from "@/store/UserStore";
import { Api } from "@/api/Api";
import { MessageItem } from "./MessageItem";
import { UserMessageView } from "./UserMessageView";
import { VideoView } from "./VideoView";

export class ChatView extends Component {

	private listUsers = new ListPanel({ width: "100%" });
	private listMessages = new ListPanel({ className: "message-list", width: "100%" });
	private sendButton = new ButtonElement({ className: "message-input", width: "18%", height: "55px", backgroundColor: "blue", color: "white", text: "Send", marginBottom: "5px" });
	private textField = new TextField({ className: "message-input", placeholder: "Type a message", height: "59px", color: "black", placeholderAnimation: false });
	private backgroundImage = ref<string>("")
	private chatId = ""
	private btnCall = ref<string>("call");

	constructor() {
		super({ display: "flex", width: "100vw", height: "100vh", overflowX: "hidden", overflowY: "auto", flexDirection: "row" });
		const left = new DivElement({ className: "list-users", width: "300px", backgroundColor: "#f0f0f0", overflow: "hidden", height: "calc(100% - 50px)" });
		left.append(this.listUsers);
		const hbox = new HBox({ gap: "10px", alignItems: "center", display: "none", width: "100%", className: "message-div-input" });
		let videoCall: VideoView | undefined = undefined;
		const toolbar = new DivElement({
			width: "100%", children: [
				new ButtonElement({
					text: this.btnCall,
					onclick: () => {
						if (videoCall) {
							videoCall.remove();
							videoCall = undefined;
							this.btnCall.value = "call";
						} else {
							this.btnCall.value = "stop";
							videoCall = toolbar.appendChild(new VideoView(this.chatId));
						}
					}
				})
			], display: "none"
		});

		const center = new DivElement({
			overflow: "hidden",
			width: "calc(100% - 300px)",
			height: "calc(100% - 50px)",
			padding: "10px",
			display: "grid", gridTemplateRows: "1fr auto",
			className: "message-div",

		});
		AppPage.socket.on("join", (chat) => {
			if (chat == undefined) {
				alert("Chat not found");
				return;
			}
			this.chatId = chat.id;
			hbox.style.display = "flex";
			toolbar.style.display = "flex";
			left.classList.remove("open");
			this.updateMessages(chat.messages);
			this.sendButton.onclick = () => {
				AppPage.socket.emit("send-message", { chat_id: chat.id, text: this.textField.value.toString() });
				this.textField.value = "";
			}
		});

		AppPage.socket.on("receive-message", (chat) => {
			if (chat.chat_id != this.chatId) {
				return; // Ignore messages from other chats
			}
			if (Array.isArray(chat)) {
				this.updateMessages(chat);
				return
			}
			this.addMessage(chat);
			this.textField.value = "";
		});

		hbox.append(this.textField, this.sendButton);
		const textArea = new DivElement({
			width: "100%", overflow: "hidden", marginBottom: "15px",
			border: "1px solid #ccc", borderRadius: "5px",
			display: "flex",
			flexDirection: "column",
			backgroundImage: this.backgroundImage,
			backgroundSize: "cover",
			backgroundPosition: "center",
		});
		textArea.append(toolbar, this.listMessages);
		center.append(textArea, hbox);
		this.append(left, center);
		this.updateMessages(undefined);
		this.append(new DivElement({
			className: "btn-chat-minimize",
			position: "fixed",
			width: "20px",
			text: "=",
			onclick: () => left.classList.toggle("open")
		}));
	}

	onDisconnected(): void {
		console.log("Disconnected from chat");
		AppPage.socket.emit("leave-chat", this.chatId);
		AppPage.socket.off("receive-message");
		AppPage.socket.off("join");
	}

	async onConnected() {
		const items = await Api.Chat.list();
		this.listUsers.removeItems();
		for (const item of items) {
			this.listUsers.addItem(new UserMessageView(item));
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
	}


}
