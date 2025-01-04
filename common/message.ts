import { User } from "./user";

export interface MessageInput {
    loftId: string;
    content: { text: string; imageUrl: string | null };
}

export interface Message extends MessageInput {
    id: string;
    sender: User;
    timestamp: string;
}

export interface MessageGroup {
    date: string;
    messages: Message[];
}
