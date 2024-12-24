import { useContext } from "react";
import { AuthFormContext } from "../contexts/AuthFormContext";

export const useAuthForm = () => {
    const context = useContext(AuthFormContext);
    if (!context) {
        throw new Error("useAuthForm must be used within a AuthFormProvider");
    }
    return context;
};
