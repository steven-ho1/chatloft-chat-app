import { useState } from "react";
import { AuthData } from "../../types/auth";
import { AuthFormContext } from "./AuthFormContext";

export const AuthFormProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const initialState: AuthData = {
        fullName: "",
        email: "",
        password: "",
    };
    const [authData, setAuthData] = useState<AuthData>(initialState);

    const resetAuthData = () => setAuthData(initialState);

    return (
        <AuthFormContext.Provider
            value={{
                authData,
                setAuthData,
                resetAuthData,
            }}
        >
            {children}
        </AuthFormContext.Provider>
    );
};
