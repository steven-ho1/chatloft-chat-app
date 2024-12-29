/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Message } from "../../../../common/message";
import { useSocket } from "../../hooks/socket";
import { useUser } from "../../hooks/user";
import "./LoftWindow.css";

const LoftWindow = () => {
    const { id } = useParams();

    const socket = useSocket();
    const [messageContent, setMessageContent] = useState("");
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const message: Message = {
            loftId: id!,
            senderId: user!.id,
            content: messageContent.trim(),
            imageUrl: null,
        };
        socket.emit("sendMessage", message);
        setMessageContent("");
    };

    useEffect(() => {
        socket.on("newMessage", (message: Message) => {
            setMessages((prevMessages: Message[]) => [
                ...prevMessages,
                message,
            ]);
        });

        socket.on("loftMessagesFetched", (messages: Message[]) => {
            setMessages(messages);
        });

        return () => {
            socket.off("newMessage");
            socket.off("loftMessagesFetched");
        };
    }, []);

    useEffect(() => {
        if (id) {
            socket.emit("enterLoft", { loftId: id });
        }
    }, [id]);

    return id ? (
        <div>
            <div>{user?.fullName}</div>
            <div>
                {messages.map((message: Message) => (
                    <div key={message.id}>{message.content}</div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    required
                />
            </form>
        </div>
    ) : (
        <div>Select a loft</div>
    );
};

export default LoftWindow;
