import { Outlet } from "react-router-dom";
import { AuthFormProvider } from "../../../contexts/authForm/AuthFormProvider";
import "./AuthLayout.css";

const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <AuthFormProvider>
                <Outlet />
            </AuthFormProvider>
        </div>
    );
};

export default AuthLayout;
