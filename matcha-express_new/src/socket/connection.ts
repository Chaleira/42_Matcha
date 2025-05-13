import { Socket } from "socket.io";
import registerChatHandlers from "./handlers/chat";
import { verifyToken } from "../utils/verifyToken";
import { io } from "./index";

export const onlineUsers = new Map<number, string>();

export default function handleConnection(socket: Socket) {
	const token = socket.handshake.headers?.token as string;

	if (!token) {
		console.log("No token provided");
		socket.emit("error", { message: "No token provided" });
		return socket.disconnect();
	}

	const user = verifyToken(token);
	if (!user) {
		console.log("Invalid token");
		socket.emit("error", { message: "Invalid token" });
		return socket.disconnect();
	}

	onlineUsers.set(user.id, socket.id);
	for (const [id, socketId] of onlineUsers.entries()) {
		if (id === user.id) continue;
		io.to(socketId).emit("user-connected", { id: user.id, username: user.username });
	}
	socket.data.userId = user.id;
	socket.data.username = user.username;
	registerChatHandlers(socket, user.id);
}
