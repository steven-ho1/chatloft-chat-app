import { useEffect } from "react";
import AuthTitle from "../../../components/auth/authTitle/AuthTitle";
import RegisterForm from "../../../components/auth/registerForm/RegisterForm";
import { useAuthForm } from "../../../hooks/authForm";
import "../shared.css";
import "./Register.css";

const Register = () => {
    const { resetAuthData } = useAuthForm();

    useEffect(() => {
        return resetAuthData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="register auth">
            <AuthTitle heading="Register"></AuthTitle>
            <RegisterForm />
        </div>
    );
};

export default Register;
