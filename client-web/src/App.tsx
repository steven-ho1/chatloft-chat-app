import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/auth/AuthLayout/AuthLayout";
import { UserProvider } from "./contexts/UserProvider";
import Login from "./pages/auth/Login/Login";
import PasswordReset from "./pages/auth/PasswordReset/PasswordReset";
import Register from "./pages/auth/Register/Register";
import Chats from "./pages/Chats/Chats";
import { HttpMethod } from "./types/httpMethods";
import { EndPoint, getEndPoint } from "./utils/apiConfig";

const App: () => React.JSX.Element = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

                if (response.ok) navigate("/chats");
                else navigate("/login");
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
            <UserProvider>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route
                            path="password-reset"
                            element={<PasswordReset />}
                        />
                    </Route>
                    <Route path="chats" element={<Chats />} />
                </Routes>
            </UserProvider>
        </div>
    );
};

export default App;
