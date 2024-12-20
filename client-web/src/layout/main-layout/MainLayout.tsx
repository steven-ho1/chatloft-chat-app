import { Outlet } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Outlet />
        </div>
    );
};

export default MainLayout;
