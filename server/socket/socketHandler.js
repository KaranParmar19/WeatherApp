import { Server } from 'socket.io';

export const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Allow Client
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`New Client Connected: ${socket.id}`);

        // Chat functionality (Unit III)
        socket.on('join_room', (data) => {
            socket.join(data);
            console.log(`User with ID: ${socket.id} joined room: ${data}`);
        });

        socket.on('send_message', (data) => {
            console.log(`Message received: ${data.message}`);
            // Broadcast to others in the room
            socket.to(data.room).emit('receive_message', data);
        });

        socket.on('disconnect', () => {
            console.log('Client Disconnected', socket.id);
        });
    });

    return io;
};
