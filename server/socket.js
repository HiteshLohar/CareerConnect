import { Server } from "socket.io";

let io;

const onlineUsers = new Map();

export const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        socket.on("register", (userId) => {

            onlineUsers.set(
                userId.toString(),
                socket.id
            );

        });

        socket.on("disconnect", () => {

            for (
                const [userId, socketId]
                of onlineUsers.entries()
            ) {

                if (socketId === socket.id) {

                    onlineUsers.delete(userId);

                    break;

                }

            }

        });

    });

    return io;
};

export const getIO = () => {

    if (!io) {

        throw new Error(
            "Socket.IO has not been initialized"
        );

    }

    return io;
};

export { onlineUsers };