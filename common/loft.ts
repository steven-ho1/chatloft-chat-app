export interface Loft {
    id?: string;
    name: string;
    description: string;
    profilePicUrl: string | null;
    ownerId?: string;
    isMember?: boolean;
}
