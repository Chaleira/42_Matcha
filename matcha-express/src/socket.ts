import { Server as SocketIOServer, Socket } from 'socket.io';

const socketInit = (io: SocketIOServer) => {
  // Handle connection event
  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    // Listening for chat messages
    socket.on('chatMessage', (message) => {
      console.log(`${socket.id}:`, message);

      // Broadcast the message to all connected clients
      io.emit('chatMessage', message);
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

export default socketInit;
