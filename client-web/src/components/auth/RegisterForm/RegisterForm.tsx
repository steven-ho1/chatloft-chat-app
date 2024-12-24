import { TextField } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthResponse } from "../../../../../common/auth";
import { EndPoint, getEndPoint } from "../../../api/apiConfig";
import { useAuthForm } from "../../../hooks/authForm";
import { useUser } from "../../../hooks/user";
import { ErrorMessage } from "../../../types/error";
import { HttpMethod } from "../../../types/httpMethods";
import { areFieldsComplete, handleFormChange } from "../../../utils/formUtils";
import CredentialFields from "../CredentialFields/CredentialFields";
import PasswordValidator from "../password-validator/PasswordValidator";
import PasswordAdornment from "../PasswordAdornment/PasswordAdornment";
import "./RegisterForm.css";

const RegisterForm = () => {
    const { authData, setAuthData } = useAuthForm();
    const { setUser } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [showConfirmationError, setShowConfirmationError] = useState(false);
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();

    const isPasswordConfirmed = () =>
        authData.password === confirmationPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isPasswordConfirmed()) {
            const endpoint = getEndPoint(EndPoint.Register);
            const options: RequestInit = {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(authData),
            };

            (async () => {
                try {
                    const response = await fetch(endpoint, options);

                    if (!response.ok) {
                        setServerError("Email is already used");
                        return;
                    }
                    const data: AuthResponse = await response.json();
                    localStorage.setItem("token", data.token!);
                    setUser(data.user!);

                    navigate("/chats");
                } catch (error) {
                    console.error(error);
                }
            })();
        } else setShowConfirmationError(true);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="auth__input-container flex-column">
                <TextField
                    className="auth__input"
                    label="Full name"
                    name="fullName"
                    value={authData.fullName}
                    onChange={(e) => handleFormChange(e, setAuthData)}
                />
                <CredentialFields error={serverError} />
                <PasswordValidator setIsPasswordValid={setIsPasswordValid} />
                <TextField
                    className="auth__input"
                    label="Confirm password"
                    type={showPassword ? "text" : "password"}
                    value={confirmationPassword}
                    onChange={(e) => {
                        setConfirmationPassword(e.target.value);
                    }}
                    error={showConfirmationError}
                    helperText={
                        showConfirmationError
                            ? ErrorMessage.PasswordConfirmationError
                            : " "
                    }
                    InputProps={{
                        endAdornment: (
                            <PasswordAdornment
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />
                        ),
                    }}
                />
            </div>
            <div className="register-form__button-container flex-column">
                <button
                    className="auth__button"
                    type="submit"
                    disabled={
                        !areFieldsComplete({
                            ...authData,
                            confirmationPassword: confirmationPassword,
                        }) || !isPasswordValid
                    }
                >
                    Create an account
                </button>
                <Link className="register-form__button-link" to="/login">
                    <button className="auth__button">Cancel</button>
                </Link>
            </div>
        </form>
    );
};

export default RegisterForm;
