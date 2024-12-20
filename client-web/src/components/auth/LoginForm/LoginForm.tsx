import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthResponse } from "../../../../../common/auth";
import { EndPoint, getEndPoint } from "../../../api/apiConfig";
import { useAuth } from "../../../hooks/auth";
import { HttpMethod } from "../../../types/httpMethods";
import { areFieldsComplete } from "../../../utils/formUtils";
import CredentialFields from "../CredentialFields/CredentialFields";
import "./LoginForm.css";

const LoginForm = () => {
    const { authData } = useAuth();
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();

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
                localStorage.setItem("token", data.token!);
                console.log(data.user);
                navigate("/chats");
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
                    Forgot your password?
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