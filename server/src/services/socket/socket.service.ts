import * as io from "socket.io";
import { Service } from "typedi";
import { LoftHandler } from "./handlers/loft.handler";
import { MessageHandler } from "./handlers/message.handler";

@Service()
export class SocketService {
    private sio!: io.Server;

    constructor(
        private loftHandler: LoftHandler,
        private messageHandler: MessageHandler
    ) {}

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
            this.loftHandler.setListeners(socket, this.sio);
            this.messageHandler.setListeners(socket, this.sio);
        });
    }
}
