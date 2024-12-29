export interface Loft {
    id?: string;
    name: string;
    description: string | null;
    profilePicUrl: string | null;
    ownerId?: string;
    isMember?: boolean;
}
