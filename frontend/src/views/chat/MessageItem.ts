import { IMessage } from "@/api/Interfaces";
import { userStore } from "@/store/UserStore";
import { Component, DivElement, SpanElement, ParagraphElement } from "typecomposer";

export class MessageItem extends Component {

	constructor(message: IMessage) {
		super({ width: "100%", display: "flex" });
		const isUser = userStore.value._id?.toString() == message.sender;
		const color = isUser ? "rgb(159 201 194)" : "rgb(195 201 203)";
		const div = new DivElement({ display: "flex", width: "auto", flexDirection: "column", alignItems: "flex-start", padding: "15px", borderRadius: "5px", backgroundColor: color, marginBottom: "5px" });
		// @ts-ignore
		div.append(new ParagraphElement({ className: "message-item", text: message.content, maxWidth: "40vw", color: "black" }));
		div.append(new SpanElement({ text: this.formatTime(new Date(message.date)), fontSize: "10px", color: "#525d62", alignSelf: isUser ? "end" : "start" }));
		this.style.justifyContent = isUser ? "flex-end" : "flex-start";
		this.append(div);
	}

	formatTime(date: Date | undefined): string {
		if (!date) return "";
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');

		return `${hours}:${minutes}:${seconds}`;
	}
}