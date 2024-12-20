import { useState } from "react";
import { AuthData } from "../types/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authData, setAuthData] = useState<AuthData>({
        fullName: "",
        email: "",
        password: "",
    });

    const resetAuthData = () =>
        setAuthData({
            fullName: "",
            email: "",
            password: "",
        });

    return (
        <AuthContext.Provider
            value={{
                authData,
                setAuthData,
                resetAuthData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
