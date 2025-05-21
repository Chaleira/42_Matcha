import { Server as HTTPServer } from "http";
import handleConnection from "./connection";
import { Server as SocketIOServer, Socket } from "socket.io";

export let io: SocketIOServer;

export function initSocket(server: HTTPServer) {
	io = new SocketIOServer(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		}
	});

	io.on("connection", handleConnection);
}
