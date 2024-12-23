import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Chats.css";

const socket = io("http://localhost:8080");
const Chats = () => {
    const [message, setMessage] = useState("");

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
        <div className="chat-container">
            <div className="chat-list">
                <input type="text" />
            </div>
            <div className="chat-bar">Username</div>
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

export default Chats;
