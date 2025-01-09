import React from "react";
import { AuthData } from "../types/auth";

export const areFieldsComplete = (fields: { [field: string]: string }) =>
    Object.values(fields).every((field: string) => field !== "");

export const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFormData: React.Dispatch<React.SetStateAction<AuthData>>
) => {
    const { name, value } = e.target;
    setFormData((prevFormData: AuthData) => ({
        ...prevFormData,
        [name]: value,
    }));
};
