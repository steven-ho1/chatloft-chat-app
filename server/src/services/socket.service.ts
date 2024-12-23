import * as io from "socket.io";
import { Service } from "typedi";

@Service()
export class SocketService {
    private sio!: io.Server;

    initSocketServer(server: Express.Application) {
        this.sio = new io.Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.handleEvents();
    }

    handleEvents() {
        this.sio.on("connection", (socket) => {
            socket.on("sendMessage", (message) => {
                socket.emit("newMessage", message);
            });
        });
    }
}
