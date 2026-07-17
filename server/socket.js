import { Server } from "socket.io";

let io;

const onlineUsers = new Map();

export const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {

        console.log("User Connected:", socket.id);

        socket.on("register", (userId) => {

            onlineUsers.set(userId, socket.id);

            console.log(`User ${userId} connected.`);
        });

        socket.on("disconnect", () => {

            for (const [userId, socketId] of onlineUsers.entries()) {

                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }

            console.log("User Disconnected:", socket.id);
        });

    });

    return io;
};

export { io, onlineUsers };