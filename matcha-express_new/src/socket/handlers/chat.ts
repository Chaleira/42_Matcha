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
		try {
			const message = await chatService.createMessage(chat_id, userId, text);

			const receiverId = await chatService.getOtherUserId(chat_id, userId);
			const receiverSocket = onlineUsers.get(receiverId);

			if (receiverSocket) {
				io.to(receiverSocket).emit("receive-message", message);
			}
		} catch (error: any) {
			mapDbError.chat(error);
			console.log("Error:", error.message);
			socket.emit("error", { message: error.message });
		}
	});

	socket.on("get-messages", async ({ chat_id }) => {
		try {
			const messages = await chatService.getChatMessages(chat_id, userId);
			socket.emit("chat-history", messages);
		} catch (error: any) {
			mapDbError.chat(error);
			console.log("Error:", error.message);
			socket.emit("error", { message: error.message });
		}
	});
}
