import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AuthResponse } from "../../common/auth";
import "./App.css";
import AuthLayout from "./components/auth/authLayout/AuthLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import { useUser } from "./hooks/user";
import Login from "./pages/auth/login/Login";
import PasswordReset from "./pages/auth/passwordReset/PasswordReset";
import Register from "./pages/auth/register/Register";
import Lofts from "./pages/Lofts";
import { HttpMethod } from "./types/httpMethods";
import { EndPoint, getEndPoint } from "./utils/apiConfig";

const App: () => React.JSX.Element = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { setUser } = useUser();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchData = async () => {
            try {
                const response = await fetch(
                    getEndPoint(EndPoint.SessionLoading),
                    {
                        method: HttpMethod.GET,
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!response.ok) {
                    navigate("/login");
                    return;
                }

                const data: AuthResponse = await response.json();
                localStorage.setItem("token", data.token!);
                setUser(data.user!);

                navigate("/lofts");
            } catch (error) {
                console.error(error);
                navigate("/login");
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };

        if (token) {
            fetchData();
        } else {
            navigate("/login");
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading ? (
        <div className="loader-container">
            <span className="loader"></span>
        </div>
    ) : (
        <div className="app">
            <Routes>
                <Route path="/" element={<Navigate to="/login" />}></Route>
                <Route element={<PublicRoute />}>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/password-reset"
                            element={<PasswordReset />}
                        />
                    </Route>
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path="/lofts" element={<Lofts />} />
                    <Route path="/lofts/:id" element={<Lofts />} />
                </Route>
                <Route path="*" element={<Navigate to="/login" />}></Route>
            </Routes>
        </div>
    );
};

export default App;
