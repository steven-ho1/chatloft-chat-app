import { DbMessage, Message, MessageInput } from "@common/message";
import { User } from "@common/user";
import { getMontrealDateTime } from "@src/utils/date";
import { Row } from "postgres";
import { Service } from "typedi";
import { PostgresDbService } from "./postgres-db.service";

@Service()
export class MessageManagementService {
    constructor(private postgreDbService: PostgresDbService) {}

    async fetchLoftMessages(loftId: string): Promise<Message[]> {
        const result = await this.postgreDbService.sql`
            SELECT m.*, u.full_name, u.profile_pic_url
            FROM messages m, users u  
            WHERE m.sender_id = u.id 
            AND loft_id = ${loftId};
        `;

        const messages: Message[] = result.map((row: Row) => ({
            id: row.id,
            sender: {
                id: row.senderId,
                fullName: row.fullName,
                profilePicUrl: row.profilePicUrl,
            },
            timestamp: row.timestamp,
            loftId: row.loftId,
            content: { text: row.text, imageUrl: row.imageUrl },
        }));

        return messages;
    }

    async saveMessageToBd(
        message: MessageInput,
        userId: string
    ): Promise<Message> {
        const timestamp = getMontrealDateTime({
            onlyTime: true,
        });

        const [dbMessage] = await this.postgreDbService.sql<DbMessage[]>`
            INSERT INTO messages (loft_id, sender_id, timestamp, text, image_url)
            VALUES (
                ${message.loftId}, 
                ${userId}, 
                ${timestamp}, 
                ${message.content.text}, 
                ${message.content.imageUrl}
            )
            RETURNING *;
        `;

        const [sender] = await this.postgreDbService.sql<User[]>`
            SELECT *
            FROM users
            WHERE id = ${userId};
        `;

        const messageToSend: Message = {
            id: dbMessage.id,
            loftId: dbMessage.loftId,
            sender,
            timestamp,
            content: { text: dbMessage.text, imageUrl: dbMessage.imageUrl },
        };

        return messageToSend;
    }
}
