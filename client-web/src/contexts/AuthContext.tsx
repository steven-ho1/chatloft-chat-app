import React from "react";
import { AuthData } from "../types/auth";

export const AuthContext = React.createContext<{
    authData: AuthData;
    setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
    resetAuthData: () => void;
} | null>(null);
