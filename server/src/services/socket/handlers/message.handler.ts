import * as io from "socket.io";
import { Service } from "typedi";

@Service()
export class MessageHandler {
    setListeners(socket: io.Socket, sio: io.Server) {
        socket.on("sendMessage", (message) => {
            sio.emit("newMessage", message);
        });
    }
}
