import React from "react";
import { AuthData } from "../../types/auth";

type AuthFormContextType = {
    authData: AuthData;
    setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
    resetAuthData: () => void;
};

export const AuthFormContext = React.createContext<AuthFormContextType | null>(
    null
);
