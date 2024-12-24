import { useEffect } from "react";
import { Link } from "react-router-dom";
import AuthTitle from "../../../components/auth/AuthTitle/AuthTitle";
import LoginForm from "../../../components/auth/LoginForm/LoginForm";
import { useAuthForm } from "../../../hooks/authForm";
import "../shared.css";
import "./Login.css";

const Login = () => {
    const { resetAuthData } = useAuthForm();

    useEffect(() => {
        return resetAuthData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="login auth">
            <AuthTitle heading="Log in"></AuthTitle>
            <LoginForm />
            <hr className="login__divider" />
            <div className="login__register-field flex-column">
                <p>Don't have an account?</p>
                <Link className="login__button-link" to="/register">
                    <button className="auth__button">Register</button>
                </Link>
            </div>
        </div>
    );
};

export default Login;
