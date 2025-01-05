import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../hooks/user";

const PublicRoute = () => {
    const { user } = useUser();
    return user ? <Navigate to={"/lofts"} replace /> : <Outlet />;
};

export default PublicRoute;
