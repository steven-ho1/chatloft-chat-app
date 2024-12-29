import { Message } from "@common/message";
import { MessageManagementService } from "@src/services/message-management.service";
import * as io from "socket.io";
import { Service } from "typedi";

@Service()
export class MessageHandler {
    constructor(private messageManagementService: MessageManagementService) {}

    setListeners(socket: io.Socket, sio: io.Server) {
        socket.on("sendMessage", async (message: Message) => {
            const savedMessage: Message =
                await this.messageManagementService.saveMessageToBd(message);

            sio.to(message.loftId).emit("newMessage", savedMessage);
        });
    }
}
