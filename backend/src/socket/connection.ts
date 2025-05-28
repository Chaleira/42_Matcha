import { Socket } from "socket.io";
import registerChatHandlers from "./handlers/chat";
import { verifyToken } from "../utils/verifyToken";
import { io } from ".";

export const onlineUsers = new Map<number, {
	id: string;
	username: string;
	userId: number;
}>();

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

	onlineUsers.set(user.id, {
		id: socket.id,
		username: `${user.first_name} ${user.last_name}`,
		userId: user.id
	});
	socket.join("user-connected");
	io.to("user-connected").emit("user-connected", Array.from(onlineUsers.values()));
	socket.data.userId = user.id;
	socket.data.username = user.username;

	socket.on("disconnect", () => {
		socket.leave("user-connected");
		onlineUsers.delete(user.id);
		io.to("user-connected").emit("user-connected", Array.from(onlineUsers.values()));
	});
	registerChatHandlers(socket, user.id);
}
