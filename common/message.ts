export interface Message {
    id?: string;
    loftId: string;
    senderId: string;
    profilePicUrl?: string | null;
    timestamp?: string;
    content: string | null;
    imageUrl: string | null;
}

// ? if value is given by server or DB
