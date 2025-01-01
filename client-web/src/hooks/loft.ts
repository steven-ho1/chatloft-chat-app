import { useContext } from "react";
import { LoftContext } from "../contexts/Loft/LoftContext";

export const useLoft = () => {
    const context = useContext(LoftContext);
    if (!context) throw new Error("useLoft must be used within a LoftProvider");
    return context;
};
