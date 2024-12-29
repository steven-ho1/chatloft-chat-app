import { Message } from "@common/message";
import { getMontrealDateTime } from "@src/utils/date";
import { Service } from "typedi";
import { PostgresDbService } from "./postgres-db.service";

@Service()
export class MessageManagementService {
    constructor(private postgreDbService: PostgresDbService) {}

    async fetchLoftMessages(loftId: string): Promise<Message[]> {
        const messages: Message[] = await this.postgreDbService.sql<Message[]>`
            SELECT *
            FROM messages
            WHERE loft_id = ${loftId};
        `;
        console.log("loftId", loftId);
        console.log("Messages fetched", messages);
        return messages;
    }

    async saveMessageToBd(message: Message): Promise<Message> {
        message.timestamp = getMontrealDateTime({
            onlyTime: true,
        });

        const messages: Message[] = await this.postgreDbService.sql<Message[]>`
            INSERT INTO messages (loft_id, sender_id, timestamp, content, image_url)
            VALUES (
                ${message.loftId}, 
                ${message.senderId}, 
                ${message.timestamp}, 
                ${message.content!}, 
                ${message.imageUrl!}
            )
            RETURNING *;
        `;
        console.log("INSERTED", messages);
        return messages[0];
    }
}
