export interface LoftCreation {
    name: string;
    description: string;
    profilePicUrl: string | null;
}

export interface Loft extends LoftCreation {
    id: string;
    ownerId: string;
    isMember?: boolean;
}
