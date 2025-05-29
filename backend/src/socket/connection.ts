import { Socket } from "socket.io";
import registerChatHandlers from "./handlers/chat";
import { verifyToken } from "../utils/verifyToken";
import { io } from ".";
import { on } from "events";

export const onlineUsers = new Map<number, {
	id: string;
	username: string;
	userId: number;
}>();

export default function handleConnection(socket: Socket) {
	const token = socket.handshake.headers?.token as string;

	if (!token) {
		console.error("No token provided for socket connection");
		socket.emit("error", { message: "No token provided" });
		return socket.disconnect();
	}

	const user = verifyToken(token);
	if (!user) {
		socket.emit("error", { message: "Invalid token" });
		return socket.disconnect();
	}

	onlineUsers.set(user.id, {
		id: socket.id,
		username: `${user.first_name} ${user.last_name}`,
		userId: user.id
	});
	socket.join("user-connected");

	console.log(`User connected: ${user.id}`);
	console.log(`Online users: ${Array.from(onlineUsers.values()).map(u => `${u.userId} - ${u.username}`).join(", ")}`);
	io.to("user-connected").emit("user-connected", Array.from(onlineUsers.values()));
	socket.data.userId = user.id;
	socket.data.username = user.username;

	socket.on("user-status", () => {
		console.log(`User status requested: ${user.id}`);
		onlineUsers.set(user.id, {
			id: socket.id,
			username: `${user.first_name} ${user.last_name}`,
			userId: user.id
		});
		socket.emit("user-connected", Array.from(onlineUsers.values()));
	});

	socket.on("disconnect", () => {
		console.log(`User disconnected: ${JSON.stringify(Array.from(onlineUsers.values()))}`);
		socket.leave("user-connected");
		onlineUsers.delete(user.id);
		io.to("user-connected").emit("user-connected", Array.from(onlineUsers.values()));
	});
	registerChatHandlers(socket, user.id);
}
