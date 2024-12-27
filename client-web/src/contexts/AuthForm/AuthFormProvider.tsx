import { useState } from "react";
import { AuthData } from "../../types/auth";
import { AuthFormContext } from "./AuthFormContext";

export const AuthFormProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
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
