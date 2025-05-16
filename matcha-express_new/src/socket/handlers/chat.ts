import { Socket } from "socket.io";
import { chatService } from "../../service/chatService";
import { io } from "../index";
import mapDbError from "../../utils/mapDbError";
import { onlineUsers } from "../connection";

export default function registerChatHandlers(socket: Socket, userId: number) {

	socket.on("disconnect", () => {
		onlineUsers.delete(userId);
		for (const [id, socketId] of onlineUsers.entries()) {
			if (id === userId) continue;
			io.to(socketId).emit("user-disconnected", { id: userId, username: socket.data.username });
		}
	});

	socket.on("send-message", async ({ chat_id, text }) => {
		console.log("send-message", chat_id, text);
		try {
			const message = await chatService.createMessage(chat_id, userId, text);
			//const receiverId = await chatService.getOtherUserId(chat_id, userId);
			//const receiverSocket = onlineUsers.get(receiverId);
			//if (receiverSocket) {
			io.to(chat_id).emit("receive-message", message);
			//}
		} catch (error: any) {
			mapDbError.chat(error);
			console.log("Error:", error.message);
			socket.emit("error", { message: error.message });
		}
	});

	socket.on("leave", ({ chat_id }) => {
		socket.leave(chat_id);
	});

	socket.on("send-message-video", async ({ chat_id, data }) => {
		socket.to(chat_id).emit("receive-message-video", { chat_id, data });
	});

	socket.on("send-message-audio", async ({ chat_id, data }) => {
		socket.to(chat_id).emit("receive-message-audio", { chat_id, data });
	});

	socket.on("join", async ({ chat_id }) => {
		console.log("join", chat_id);
		try {
			if (socket.data?.chatId) socket.leave(socket.data.chatId);
			const messages = await chatService.getChatMessages(chat_id, userId);
			socket.join(chat_id);
			socket.data.chatId = chat_id;
			socket.emit("join", { id: chat_id, messages: messages });
		} catch (error: any) {
			mapDbError.chat(error);
			console.log("Error:", error.message);
			socket.emit("error", { message: error.message });
		}
	});
}
