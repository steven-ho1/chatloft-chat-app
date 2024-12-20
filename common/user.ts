export interface UserReference {
    userId: string;
    fullName: string;
    profilePic: string;
}

export interface User extends UserReference {}

export const DEFAULT_PROFILE_PIC = "default-profile-pic.png";
