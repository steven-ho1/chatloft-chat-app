import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthResponse } from "../../../../../common/auth";
import { useAuthForm } from "../../../hooks/authForm";
import { useUser } from "../../../hooks/user";
import { HttpMethod } from "../../../types/httpMethods";
import { EndPoint, getEndPoint } from "../../../utils/apiConfig";
import { areFieldsComplete } from "../../../utils/formUtils";
import CredentialFields from "../credentialFields/CredentialFields";
import "./LoginForm.css";

const LoginForm = () => {
    const { authData } = useAuthForm();
    const { setUserSession } = useUser();
    const [serverError, setServerError] = useState("");

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = getEndPoint(EndPoint.Login);
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
                    setServerError("Credentials invalid");
                    return;
                }
                const data: AuthResponse = await response.json();
                setUserSession(data.user, data.token);
            } catch (error) {
                console.error(error);
            }
        })();
    };

    return (
        <form className="login-form flex-column" onSubmit={handleFormSubmit}>
            <div className="auth__input-container flex-column">
                <CredentialFields error={serverError} />
                <Link
                    className="login-form__password-reset-link"
                    to="/password-reset"
                >
                    Forgot your password? (not done yet)
                </Link>
            </div>
            <button
                className="auth__button"
                type="submit"
                disabled={
                    !areFieldsComplete({
                        email: authData.email,
                        password: authData.password,
                    })
                }
            >
                Continue
            </button>
        </form>
    );
};

export default LoginForm;
