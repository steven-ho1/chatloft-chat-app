import { useNavigate } from "react-router-dom";
import ChatList from "../../components/ChatList/ChatList";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import { SocketProvider } from "../../contexts/Socket/SocketProvider";
import "./Chats.css";

const Chats = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="chat-container">
            <SocketProvider>
                <ChatList />
                <ChatWindow />
                <div>
                    <button onClick={logout}>Logout</button>
                </div>
            </SocketProvider>
        </div>
    );
};

export default Chats;
