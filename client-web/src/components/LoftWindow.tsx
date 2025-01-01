/* eslint-disable react-hooks/exhaustive-deps */
import { Send } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import {
    AppBar,
    Avatar,
    Box,
    Divider,
    IconButton,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Message } from "../../../common/message";
import { useLoft } from "../hooks/loft";
import { useSocket } from "../hooks/socket";
import { useUser } from "../hooks/user";

const LoftWindow = () => {
    const socket = useSocket();
    const { activeLoft } = useLoft();
    const [messageContent, setMessageContent] = useState("");
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = () => {
        const message: Message = {
            loftId: activeLoft?.id as string,
            senderId: user!.id,
            content: messageContent.trim(),
            imageUrl: null,
        };
        socket.emit("sendMessage", message);
        setMessageContent("");
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            sendMessage();
        }
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
        if (activeLoft?.id) {
            socket.emit("enterLoft", { loftId: activeLoft.id });
        }
    }, [activeLoft]);

    return activeLoft ? (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <AppBar position="static">
                <Toolbar>
                    <Avatar
                        alt="Profile pic"
                        src={activeLoft.profilePicUrl!}
                        sx={{ border: "1px solid #424242", mr: 1 }}
                    />
                    <Typography sx={{ flex: 1 }}>{activeLoft.name}</Typography>
                    <IconButton color="inherit">
                        <InfoIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    flex: 1,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    gap: 1,
                }}
            >
                {messages.map((message: Message) => (
                    <Box key={message.id} sx={{}}>
                        <Box
                            sx={{
                                padding: 1,
                                borderRadius: 2,
                                backgroundColor:
                                    message.senderId === user?.id
                                        ? "primary.main"
                                        : "#e0e0e0",
                                maxWidth: "100%",
                            }}
                        >
                            <Typography variant="body2">
                                {message.content}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
            <Divider flexItem />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                }}
            >
                <TextField
                    variant="filled"
                    fullWidth
                    placeholder="Type a message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <IconButton onClick={sendMessage} color="primary">
                    <Send />
                </IconButton>
            </Box>
        </Box>
    ) : (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}
        >
            <Typography>Select a loft</Typography>
        </Box>
    );
};

export default LoftWindow;
