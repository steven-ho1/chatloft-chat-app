import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/socket";
import { useUser } from "../../hooks/user";

const ChatWindow = () => {
    const socket = useSocket();
    const [message, setMessage] = useState("");
    const { user } = useUser();

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        socket.emit("sendMessage", message);
        setMessage("");
    };

    useEffect(() => {
        socket.on("newMessage", (message) => {
            console.log(message);
        });

        return () => {
            socket.off("newMessage");
        };
    });
    return (
        <div>
            <div className="chat-bar">{user?.fullName}</div>
            <div className="messages-container"></div>
            <form className="input-container" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
            </form>
        </div>
    );
};

export default ChatWindow;
