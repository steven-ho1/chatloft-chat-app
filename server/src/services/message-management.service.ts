import { Message, MessageGroup, MessageInput } from "@common/message";
import { User } from "@common/user";
import { getMontrealDateTime } from "@src/utils/date";
import { isToday, isYesterday, parse } from "date-fns";
import { Row } from "postgres";
import { Service } from "typedi";
import { PostgresDbService } from "./postgres-db.service";

@Service()
export class MessageManagementService {
    constructor(private postgreDbService: PostgresDbService) {}

    async fetchLoftMessages(
        loftId: string
    ): Promise<{ date: string; messages: Message[] }[]> {
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

        const messageGroups = this.groupMessages(messages);
        const formattedMessageGroups = this.formatMessageDates(messageGroups);

        return formattedMessageGroups;
    }

    async saveMessageToBd(
        messageInput: MessageInput,
        userId: string
    ): Promise<Message> {
        const [result] = await this.postgreDbService.sql`
            INSERT INTO messages (loft_id, sender_id, timestamp, text, image_url)
            VALUES (
                ${messageInput.loftId}, 
                ${userId}, 
                ${getMontrealDateTime()}, 
                ${messageInput.content.text}, 
                ${messageInput.content.imageUrl}
            )
            RETURNING id;
        `;

        const [sender] = await this.postgreDbService.sql<User[]>`
            SELECT *
            FROM users
            WHERE id = ${userId};
        `;

        const message: Message = {
            id: result.id,
            sender,
            timestamp: getMontrealDateTime({ onlyTime: true }),
            ...messageInput,
        };

        return message;
    }

    private groupMessages(messages: Message[]) {
        return messages.reduce(
            (messageGroups: MessageGroup[], message: Message) => {
                const [date, time] = message.timestamp
                    .replace(/\s+/g, "")
                    .split(",");
                message.timestamp = time;

                const messageGroupToUpdate = messageGroups.find(
                    (messageGroup: { date: string; messages: Message[] }) =>
                        messageGroup.date === date
                );
                if (messageGroupToUpdate) {
                    messageGroupToUpdate.messages.push(message);
                } else {
                    messageGroups.push({ date, messages: [message] });
                }
                return messageGroups;
            },
            []
        );
    }

    private formatMessageDates(messageGroups: MessageGroup[]) {
        const todayDate: string = getMontrealDateTime({ onlyDate: true });
        const todayMessageGroupExists: boolean = messageGroups.some(
            (messageGroup: MessageGroup) => messageGroup.date === todayDate
        );
        if (!todayMessageGroupExists)
            messageGroups.push({ date: todayDate, messages: [] });

        const formattedMessageGroups = messageGroups.map(
            (messageGroup: MessageGroup) => {
                const dateToCheck = parse(
                    messageGroup.date,
                    "dd/MM/yyyy",
                    new Date()
                );
                if (isToday(dateToCheck)) {
                    messageGroup.date = "Today";
                } else if (isYesterday(dateToCheck)) {
                    messageGroup.date = "Yesterday";
                }
                return messageGroup;
            }
        );

        return formattedMessageGroups;
    }
}
