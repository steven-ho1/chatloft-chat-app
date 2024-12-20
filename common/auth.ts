import { User } from "./user";

export interface AuthData {
    fullName?: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token?: string;
    user?: User;
}

export interface Credentials {
    userId: string;
    email: string;
    password: string;
}
