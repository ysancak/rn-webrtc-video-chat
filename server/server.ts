import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { CallData, IIceCandidate, IOffer } from './types';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register', (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  socket.on('start_call', ({ fromUser, toUser }: CallData) => {
    console.log(`Call started from ${fromUser} to ${toUser}`);
    console.log(`Emitting incoming_call to ${toUser}`);
    io.to(toUser).emit('incoming_call', { fromUser });
  });

  socket.on('accept_call', ({ fromUser, toUser }: CallData) => {
    console.log(`Call accepted by ${fromUser} from ${toUser}`);
    io.to(toUser).emit('call_accepted', { fromUser });
  });

  socket.on('reject_call', ({ fromUser, toUser }: CallData) => {
    console.log(`Call rejected by ${toUser} from ${fromUser}`);
    io.to(toUser).emit('call_rejected', { fromUser });
  });

  socket.on('offer', ({ toUser, sdp }: IOffer) => {
    console.log(`Received offer to ${toUser}`);
    io.to(toUser).emit('offer', { sdp });
  });

  socket.on('answer', ({ toUser, sdp }: IOffer) => {
    console.log(`Received answer to ${toUser}`);
    io.to(toUser).emit('answer', { sdp });

  });

  socket.on('ice_candidate', ({ toUser, candidate }: IIceCandidate) => {
    console.log(`Received ICE candidate to ${toUser}`);
    io.to(toUser).emit('ice_candidate', { candidate });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
