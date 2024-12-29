import { useNavigate } from "react-router-dom";
import LoftList from "../../components/LoftList/LoftList";
import LoftWindow from "../../components/LoftWindow/LoftWindow";
import { SocketProvider } from "../../contexts/Socket/SocketProvider";
import "./Lofts.css";

const Lofts = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="loft-container">
            <SocketProvider>
                <LoftList />
                <LoftWindow />
                <div>
                    <button onClick={logout}>Logout</button>
                </div>
            </SocketProvider>
        </div>
    );
};

export default Lofts;
