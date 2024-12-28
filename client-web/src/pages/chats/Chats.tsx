import ChatList from "../../components/ChatList/ChatList";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import { SocketProvider } from "../../contexts/Socket/SocketProvider";
import "./Chats.css";

const Chats = () => {
    return (
        <div className="chat-container">
            <SocketProvider>
                <ChatList />
                <ChatWindow />
            </SocketProvider>
        </div>
    );
};

export default Chats;
