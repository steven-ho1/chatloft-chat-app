import { Message, MessageInput } from "@common/message";
import { MessageManagementService } from "@src/services/message-management.service";
import * as io from "socket.io";
import { Service } from "typedi";

@Service()
export class MessageHandler {
    constructor(private messageManagementService: MessageManagementService) {}

    setListeners(socket: io.Socket, sio: io.Server) {
        const { userId } = socket.handshake.auth as { userId: string };

        socket.on("sendMessage", async (messageInput: MessageInput) => {
            try {
                const savedMessage: Message =
                    await this.messageManagementService.saveMessageToBd(
                        messageInput,
                        userId
                    );

                sio.to(savedMessage.loftId).emit("newMessage", savedMessage);
            } catch (error) {
                console.log("Error while sending message:\n", error);
            }
        });
    }
}
