import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatModel } from './model/chat/ChatModel';

const socketInit = (io: SocketIOServer) => {
  // Handle connection event
  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    socket.on("message", async (room, userId, message) => {
      const data = {
        sender: userId,
        content: message,
        date: new Date()
      }
      io.to(room).emit("message", data);
      const chat = await ChatModel.findById(room);
      if (chat) {
        console.log("Chat found:", chat);
        chat.messages.push(data);
        chat.save();
      }
      else
        console.log("Chat not found");
    });

    // Cliente sai da sala
    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log(`Cliente ${socket.id} saiu da sala ${room}`);
      socket.to(room).emit("message", `Cliente ${socket.id} saiu da sala!`);
    });

    socket.on("joinRoom", async (room) => {
      const chat = await ChatModel.findById(room);
      socket.join(room);
      socket.emit("joinRoom", chat);
      console.log(`Cliente ${socket.id} entrou na sala ${room}`);
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

export default socketInit;
